// Repository Controller - 100% Onchain (No MongoDB)
// Uses only Story Protocol + IPFS

const onchainStorage = require('../services/onchainStorage');

// @desc    Create new repository (100% onchain)
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

    console.log('🚀 Creating 100% onchain repository...');

    // Create repository on blockchain + IPFS
    const result = await onchainStorage.createRepository({
      title,
      description,
      file,
      owner: walletAddress,
      licenseType: licenseType || 'open',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    });

    console.log(`✅ Repository created onchain: ${result.ipAssetId}`);

    res.status(201).json({
      success: true,
      repository: {
        ipAssetId: result.ipAssetId,
        title,
        description,
        owner: walletAddress,
        licenseType: licenseType || 'open',
        codeCID: result.codeCID,
        metadataCID: result.metadataCID,
        ipfsUrl: result.ipfsUrl,
        txHash: result.txHash,
        blockNumber: result.blockNumber,
        timestamp: result.timestamp,
      },
      blockchain: {
        network: 'Story Protocol',
        verified: true,
        decentralized: true,
      },
    });
  } catch (error) {
    console.error('❌ Create repository error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create repository',
      details: 'Repository creation failed on blockchain',
    });
  }
};

// @desc    Get repository by ID (from blockchain)
// @route   GET /api/repo/:id
// @access  Public
exports.getRepository = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🔍 Fetching repository ${id} from blockchain...`);

    const repository = await onchainStorage.getRepository(id);

    if (!repository) {
      return res.status(404).json({
        success: false,
        error: 'Repository not found on blockchain',
      });
    }

    res.status(200).json({
      success: true,
      repository,
      blockchain: {
        network: 'Story Protocol',
        verified: true,
        source: 'blockchain',
      },
    });
  } catch (error) {
    console.error('❌ Get repository error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repository from blockchain',
    });
  }
};

// @desc    Get user repositories (from blockchain)
// @route   GET /api/repo/user/:wallet
// @access  Public
exports.getUserRepositories = async (req, res) => {
  try {
    const { wallet } = req.params;
    const walletLower = wallet.toLowerCase();

    console.log(`🔍 Fetching repositories for ${walletLower} from blockchain...`);

    const repositories = await onchainStorage.getUserRepositories(walletLower);

    res.status(200).json({
      success: true,
      count: repositories.length,
      repositories,
      blockchain: {
        network: 'Story Protocol',
        verified: true,
        source: 'blockchain',
      },
    });
  } catch (error) {
    console.error('❌ Get user repositories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repositories from blockchain',
    });
  }
};

// @desc    Get all repositories (from blockchain)
// @route   GET /api/repo
// @access  Public
exports.getAllRepositories = async (req, res) => {
  try {
    const { search, license } = req.query;

    console.log('🔍 Fetching all repositories from blockchain...');

    // Note: Blockchain querying is limited
    // For production, use The Graph or similar indexer for advanced queries
    
    if (search) {
      const results = await onchainStorage.searchRepositories(search);
      return res.status(200).json({
        success: true,
        count: results.length,
        repositories: results,
        note: 'Blockchain search is limited. Consider using The Graph for advanced queries.',
      });
    }

    // For now, return empty array or implement indexer
    res.status(200).json({
      success: true,
      count: 0,
      repositories: [],
      note: 'Use /api/repo/user/:wallet to fetch repositories by owner',
      blockchain: {
        network: 'Story Protocol',
        verified: true,
      },
    });
  } catch (error) {
    console.error('❌ Get all repositories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repositories',
    });
  }
};

// @desc    Get user profile (from blockchain)
// @route   GET /api/user/:wallet
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const { wallet } = req.params;
    const walletLower = wallet.toLowerCase();

    console.log(`🔍 Fetching profile for ${walletLower} from blockchain...`);

    const profile = await onchainStorage.getUserProfile(walletLower);

    res.status(200).json({
      success: true,
      user: profile,
      blockchain: {
        network: 'Story Protocol',
        verified: true,
        source: 'blockchain',
      },
    });
  } catch (error) {
    console.error('❌ Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
    });
  }
};

// @desc    Update user bio (store on IPFS)
// @route   PUT /api/user/:wallet/bio
// @access  Private
exports.updateUserBio = async (req, res) => {
  try {
    const { wallet } = req.params;
    const { bio } = req.body;
    const userWallet = req.user.walletAddress;

    // Verify user is updating their own profile
    if (wallet.toLowerCase() !== userWallet.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: Cannot update another user\'s profile',
      });
    }

    if (!bio || bio.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bio is required',
      });
    }

    if (bio.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Bio must be less than 500 characters',
      });
    }

    console.log(`📝 Updating bio for ${userWallet}...`);

    const result = await onchainStorage.updateUserBio(userWallet, bio);

    res.status(200).json({
      success: true,
      message: 'Bio updated and stored on IPFS',
      ipfsCID: result.ipfsCID,
      ipfsUrl: result.ipfsUrl,
      blockchain: {
        network: 'IPFS',
        verified: true,
        decentralized: true,
      },
    });
  } catch (error) {
    console.error('❌ Update bio error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update bio',
    });
  }
};

module.exports = exports;
