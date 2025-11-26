// Repository Controller - Blockchain-First Architecture
// MongoDB is ONLY a cache - Story Protocol is source of truth

const Repository = require('../models/Repository');
const Commit = require('../models/Commit');
const User = require('../models/User');
const ipfsService = require('../services/ipfsService');
const storyService = require('../services/storyService');
const blockchainSync = require('../services/blockchainSync');

// @desc    Create new repository (writes to blockchain first, then cache)
// @route   POST /api/repo/create
// @access  Private
exports.createRepository = async (req, res) => {
  try {
    const { title, description, licenseType, tags } = req.body;
    const walletAddress = req.user.walletAddress;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title and description are required',
      });
    }

    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        error: 'File is required',
      });
    }

    const file = req.files.file;

    // Validate file
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 52428800; // 50MB
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
      });
    }

    // Step 1: Upload to IPFS (Decentralized Storage)
    console.log('📤 Uploading to IPFS...');
    const ipfsResult = await ipfsService.uploadBuffer(file.data, file.name);

    // Step 2: Register IP on Story Protocol (Source of Truth)
    console.log('📝 Registering IP Asset on Story Protocol...');
    const storyResult = await storyService.registerIPAsset({
      title,
      description,
      ipfsCid: ipfsResult.cid,
      ipfsUrl: ipfsResult.url,
      owner: walletAddress,
    });

    if (!storyResult.registered) {
      throw new Error('Failed to register IP Asset on blockchain');
    }

    console.log(`✅ IP Asset registered: ${storyResult.ipAssetId}`);

    // Step 3: Attach license on blockchain
    console.log('🔐 Attaching license terms...');
    await storyService.attachLicense(storyResult.ipAssetId, licenseType || 'open');

    // Step 4: Cache in MongoDB for fast queries
    console.log('💾 Caching repository metadata...');
    const repoId = `repo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const repository = new Repository({
      repoId,
      title,
      description,
      owner: walletAddress,
      licenseType: licenseType || 'open',
      ipfsCid: ipfsResult.cid,
      ipfsUrl: ipfsResult.url,
      ipAssetId: storyResult.ipAssetId,
      ipAssetTxHash: storyResult.txHash,
      ipAssetRegistered: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.mimetype,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      contributors: [{
        walletAddress,
        contributions: 1,
      }],
      // Cache metadata
      lastSyncedAt: new Date(),
      cacheSource: 'blockchain',
      blockchainVerified: true,
    });

    await repository.save();

    // Update user cache
    const user = await User.findOne({ walletAddress });
    if (user) {
      user.repositories.push(repository._id);
      user.totalContributions += 1;
      user.lastSyncedAt = new Date();
      await user.save();
    }

    console.log(`✅ Repository cached: ${repository.repoId}`);

    res.status(201).json({
      success: true,
      repository: {
        repoId: repository.repoId,
        title: repository.title,
        description: repository.description,
        owner: repository.owner,
        licenseType: repository.licenseType,
        ipfsCid: repository.ipfsCid,
        ipfsUrl: repository.ipfsUrl,
        ipAssetId: repository.ipAssetId,
        ipAssetTxHash: repository.ipAssetTxHash,
        blockchainVerified: true,
        createdAt: repository.createdAt,
      },
      blockchain: {
        source: 'story_protocol',
        verified: true,
        txHash: storyResult.txHash,
      }
    });
  } catch (error) {
    console.error('❌ Create repository error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create repository',
      details: 'Repository creation failed. Blockchain registration required.',
    });
  }
};

// @desc    Get repository by ID (tries cache first, then blockchain)
// @route   GET /api/repo/:id
// @access  Public
exports.getRepository = async (req, res) => {
  try {
    const { id } = req.params;
    const { verify = 'false' } = req.query;

    // Try cache first
    let repository = await Repository.findOne({ repoId: id })
      .populate('commits')
      .populate('ownerRef', 'walletAddress username avatar')
      .lean();

    if (!repository) {
      // Not in cache - try to find by ipAssetId on blockchain
      console.log('🔍 Repository not in cache, querying blockchain...');
      
      // Search blockchain by IP Asset ID (if id looks like an IP Asset ID)
      if (id.startsWith('0x') || id.includes('ipasset')) {
        try {
          const syncedRepo = await blockchainSync.syncRepository(id);
          repository = syncedRepo.toObject();
          repository.fromBlockchain = true;
        } catch (error) {
          console.error('Blockchain query failed:', error.message);
        }
      }

      if (!repository) {
        return res.status(404).json({
          success: false,
          error: 'Repository not found',
          hint: 'Repository not in cache and not found on blockchain',
        });
      }
    }

    // If verification requested, check against blockchain
    let verification = null;
    if (verify === 'true' && repository.ipAssetId) {
      console.log('🔐 Verifying repository against blockchain...');
      verification = await blockchainSync.verifyCache(repository.ipAssetId);
      
      // If cache is outdated, resync
      if (!verification.verified && verification.action === 'resync_required') {
        console.log('🔄 Cache outdated, resyncing from blockchain...');
        const syncedRepo = await blockchainSync.syncRepository(repository.ipAssetId);
        repository = syncedRepo.toObject();
        verification.resynced = true;
      }
    }

    res.status(200).json({
      success: true,
      repository,
      cache: {
        lastSynced: repository.lastSyncedAt,
        source: repository.cacheSource,
        verified: repository.blockchainVerified,
      },
      verification: verification || undefined,
    });
  } catch (error) {
    console.error('❌ Get repository error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repository',
    });
  }
};

// @desc    Get user repositories (cache first, with blockchain fallback)
// @route   GET /api/repo/user/:wallet
// @access  Public
exports.getUserRepositories = async (req, res) => {
  try {
    const { wallet } = req.params;
    const { syncFromBlockchain = 'false' } = req.query;
    const walletLower = wallet.toLowerCase();

    // If sync requested, fetch from blockchain first
    if (syncFromBlockchain === 'true') {
      console.log('🔄 Syncing user repositories from blockchain...');
      await blockchainSync.syncUserRepositories(walletLower);
    }

    // Get cached repositories
    const repositories = await Repository.find({ owner: walletLower })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: repositories.length,
      repositories,
      cache: {
        canSync: true,
        lastUpdated: repositories[0]?.lastSyncedAt,
      },
    });
  } catch (error) {
    console.error('❌ Get user repositories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repositories',
    });
  }
};

// @desc    Get all repositories (public, cache only for performance)
// @route   GET /api/repo
// @access  Public
exports.getAllRepositories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, license } = req.query;

    const query = { isPublic: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (license) {
      query.licenseType = license;
    }

    const repositories = await Repository.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('ownerRef', 'walletAddress username avatar')
      .lean();

    const count = await Repository.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      repositories,
      note: 'Data from cache. Add ?verify=true to any repo to verify against blockchain',
    });
  } catch (error) {
    console.error('❌ Get all repositories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repositories',
    });
  }
};

// @desc    Verify repository against blockchain
// @route   GET /api/repo/:id/verify
// @access  Public
exports.verifyRepository = async (req, res) => {
  try {
    const { id } = req.params;

    const repository = await Repository.findOne({ repoId: id });

    if (!repository) {
      return res.status(404).json({
        success: false,
        error: 'Repository not found in cache',
      });
    }

    if (!repository.ipAssetId) {
      return res.status(400).json({
        success: false,
        error: 'Repository not registered on blockchain',
      });
    }

    console.log(`🔐 Verifying repository ${id} against blockchain...`);
    const verification = await blockchainSync.verifyCache(repository.ipAssetId);

    // If verification failed, attempt to resync
    if (!verification.verified && verification.action === 'resync_required') {
      console.log('🔄 Cache mismatch detected, resyncing...');
      await blockchainSync.syncRepository(repository.ipAssetId);
      verification.resynced = true;
    }

    res.status(200).json({
      success: true,
      repository: {
        repoId: repository.repoId,
        ipAssetId: repository.ipAssetId,
      },
      verification,
      blockchain: {
        source: 'story_protocol',
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('❌ Verify repository error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify repository',
    });
  }
};

// @desc    Sync repository from blockchain
// @route   POST /api/repo/:id/sync
// @access  Public
exports.syncRepository = async (req, res) => {
  try {
    const { id } = req.params;

    // id can be repoId or ipAssetId
    let ipAssetId = id;

    // If it's a repoId, find the ipAssetId
    if (!id.startsWith('0x')) {
      const repo = await Repository.findOne({ repoId: id });
      if (!repo || !repo.ipAssetId) {
        return res.status(404).json({
          success: false,
          error: 'Repository not found or not registered on blockchain',
        });
      }
      ipAssetId = repo.ipAssetId;
    }

    console.log(`🔄 Syncing repository ${ipAssetId} from blockchain...`);
    const syncedRepo = await blockchainSync.syncRepository(ipAssetId);

    res.status(200).json({
      success: true,
      message: 'Repository synced from blockchain',
      repository: syncedRepo,
      blockchain: {
        source: 'story_protocol',
        syncedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('❌ Sync repository error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync repository from blockchain',
      details: error.message,
    });
  }
};

// @desc    Get blockchain sync status
// @route   GET /api/repo/sync/status
// @access  Public
exports.getSyncStatus = async (req, res) => {
  try {
    const status = blockchainSync.getStatus();
    
    res.status(200).json({
      success: true,
      sync: status,
      architecture: {
        primary: 'Story Protocol Blockchain',
        cache: 'MongoDB',
        storage: 'IPFS (Pinata)',
        cacheTTL: '30 days',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get sync status',
    });
  }
};

module.exports = exports;
