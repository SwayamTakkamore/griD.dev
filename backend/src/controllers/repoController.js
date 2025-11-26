const Repository = require('../models/Repository');
const Commit = require('../models/Commit');
const User = require('../models/User');
const ipfsService = require('../services/ipfsService');
const storyService = require('../services/storyService');
const fs = require('fs');
const path = require('path');

// Import new encrypted Repo model (if available)
let Repo;
try {
  require('ts-node/register');
  Repo = require('../models/Repo.ts').default;
} catch (error) {
  console.warn('⚠️  Encrypted Repo model not available');
}

// @desc    Create new repository
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

    // Upload to IPFS
    console.log('📤 Uploading to IPFS...');
    const ipfsResult = await ipfsService.uploadBuffer(file.data, file.name);

    // Register IP on Story Protocol
    console.log('📝 Registering IP Asset...');
    const storyResult = await storyService.registerIPAsset({
      title,
      description,
      ipfsCid: ipfsResult.cid,
      ipfsUrl: ipfsResult.url,
      owner: walletAddress,
    });

    // Generate unique repo ID
    const repoId = `repo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create repository in MongoDB
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
      ipAssetRegistered: storyResult.registered,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.mimetype,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      contributors: [{
        walletAddress,
        contributions: 1,
      }],
    });

    await repository.save();

    // Update user
    const user = await User.findOne({ walletAddress });
    if (user) {
      user.repositories.push(repository._id);
      user.totalContributions += 1;
      await user.save();
    }

    // Attach license if using Story Protocol
    if (storyResult.registered) {
      await storyService.attachLicense(storyResult.ipAssetId, licenseType || 'open');
    }

    console.log(`✅ Repository created: ${repository.repoId}`);

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
        createdAt: repository.createdAt,
      },
    });
  } catch (error) {
    console.error('Create repository error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create repository',
    });
  }
};

// @desc    Get repository by ID
// @route   GET /api/repo/:id
// @access  Public
exports.getRepository = async (req, res) => {
  try {
    const { id } = req.params;

    // Try old Repository model first
    let repository = await Repository.findOne({ repoId: id })
      .populate('commits')
      .populate('ownerRef', 'walletAddress username avatar')
      .lean();

    // If not found, try new Repo model
    if (!repository && Repo) {
      repository = await Repo.findOne({ repoId: id }).lean();
      if (repository) {
        repository.source = 'new';
      }
    }

    if (!repository) {
      return res.status(404).json({
        success: false,
        error: 'Repository not found',
      });
    }

    res.status(200).json({
      success: true,
      repository,
    });
  } catch (error) {
    console.error('Get repository error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repository',
    });
  }
};

// @desc    Get user repositories
// @route   GET /api/repo/user/:wallet
// @access  Public
exports.getUserRepositories = async (req, res) => {
  try {
    const { wallet } = req.params;
    const walletLower = wallet.toLowerCase();

    // Query both old Repository and new Repo collections
    const [oldRepos, newRepos] = await Promise.all([
      Repository.find({ owner: walletLower }).sort({ createdAt: -1 }).lean(),
      Repo ? Repo.find({ 
        $or: [
          { owner: walletLower },
          { ownerWallet: walletLower }
        ]
      }).sort({ createdAt: -1 }).lean() : Promise.resolve([])
    ]);

    // Merge results
    const allRepositories = [
      ...oldRepos.map(repo => ({ ...repo, _id: repo._id.toString(), source: 'old' })),
      ...newRepos.map(repo => ({ ...repo, _id: repo._id.toString(), source: 'new' }))
    ];

    // Sort by creation date
    allRepositories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: allRepositories.length,
      repositories: allRepositories,
    });
  } catch (error) {
    console.error('Get user repositories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repositories',
    });
  }
};

// @desc    Create commit
// @route   POST /api/repo/commit
// @access  Private
exports.createCommit = async (req, res) => {
  try {
    const { repoId, message, description } = req.body;
    const walletAddress = req.user.walletAddress;

    if (!repoId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Repository ID and commit message are required',
      });
    }

    const repository = await Repository.findOne({ repoId });

    if (!repository) {
      return res.status(404).json({
        success: false,
        error: 'Repository not found',
      });
    }

    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        error: 'File is required',
      });
    }

    const file = req.files.file;

    // Upload to IPFS
    console.log('📤 Uploading commit to IPFS...');
    const ipfsResult = await ipfsService.uploadBuffer(file.data, file.name);

    // Get last commit number
    const lastCommit = await Commit.findOne({ repoId })
      .sort({ commitNumber: -1 });
    const commitNumber = lastCommit ? lastCommit.commitNumber + 1 : 1;

    // Create commit
    const commit = new Commit({
      repositoryId: repository._id,
      repoId,
      author: walletAddress,
      message,
      description,
      ipfsCid: ipfsResult.cid,
      ipfsUrl: ipfsResult.url,
      fileName: file.name,
      fileSize: file.size,
      commitNumber,
      parentCommit: lastCommit ? lastCommit._id : null,
    });

    await commit.save();

    // Update repository
    repository.commits.push(commit._id);
    await repository.addContributor(walletAddress);

    // Update user contributions
    const user = await User.findOne({ walletAddress });
    if (user) {
      user.totalContributions += 1;
      await user.save();
    }

    // Track contribution on Story Protocol
    if (repository.ipAssetId && repository.ipAssetRegistered) {
      await storyService.trackContribution(
        repository.ipAssetId,
        walletAddress,
        { message, commitNumber }
      );
    }

    console.log(`✅ Commit created: ${commit.commitId}`);

    res.status(201).json({
      success: true,
      commit: {
        commitId: commit.commitId,
        message: commit.message,
        author: commit.author,
        ipfsCid: commit.ipfsCid,
        ipfsUrl: commit.ipfsUrl,
        commitNumber: commit.commitNumber,
        createdAt: commit.createdAt,
      },
    });
  } catch (error) {
    console.error('Create commit error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create commit',
    });
  }
};

// @desc    Get all repositories (public)
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

    // Query both old Repository and new Repo collections
    const [oldRepos, newRepos] = await Promise.all([
      Repository.find(query)
        .sort({ createdAt: -1 })
        .populate('ownerRef', 'walletAddress username avatar')
        .lean(),
      Repo ? Repo.find(license ? { licenseType: license } : {})
        .sort({ createdAt: -1 })
        .lean() : Promise.resolve([])
    ]);

    // Merge and normalize the results
    let allRepositories = [
      ...oldRepos.map(repo => ({
        ...repo,
        _id: repo._id.toString(),
        source: 'old'
      })),
      ...newRepos.map(repo => ({
        ...repo,
        _id: repo._id.toString(),
        isPublic: true, // Encrypted repos are queryable by metadata
        source: 'new'
      }))
    ];

    // Apply search filter to new repos (since they don't have isPublic field)
    if (search) {
      allRepositories = allRepositories.filter(repo => {
        if (repo.source === 'old') return true; // Already filtered by query
        const searchLower = search.toLowerCase();
        return (
          repo.title?.toLowerCase().includes(searchLower) ||
          repo.description?.toLowerCase().includes(searchLower) ||
          repo.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      });
    }

    // Sort by creation date
    allRepositories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const count = allRepositories.length;
    const paginatedRepos = allRepositories.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      repositories: paginatedRepos,
    });
  } catch (error) {
    console.error('Get all repositories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repositories',
    });
  }
};
