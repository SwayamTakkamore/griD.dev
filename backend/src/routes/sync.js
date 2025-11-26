// Blockchain Sync API Routes
const express = require('express');
const router = express.Router();
const blockchainSync = require('../services/blockchainSync');
const Repository = require('../models/Repository');

// @desc    Get sync service status
// @route   GET /api/sync/status
// @access  Public
router.get('/status', (req, res) => {
  try {
    const status = blockchainSync.getStatus();
    
    res.json({
      success: true,
      sync: status,
      architecture: {
        primary: 'Story Protocol Blockchain',
        cache: 'MongoDB (TTL: 30 days)',
        storage: 'IPFS via Pinata',
        decentralized: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Verify specific repository against blockchain
// @route   GET /api/sync/verify/:ipAssetId
// @access  Public
router.get('/verify/:ipAssetId', async (req, res) => {
  try {
    const { ipAssetId } = req.params;
    
    console.log(`🔐 Verifying ${ipAssetId} against blockchain...`);
    const verification = await blockchainSync.verifyCache(ipAssetId);
    
    res.json({
      success: true,
      ipAssetId,
      verification,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Sync single repository from blockchain
// @route   POST /api/sync/repository/:ipAssetId
// @access  Public
router.post('/repository/:ipAssetId', async (req, res) => {
  try {
    const { ipAssetId } = req.params;
    
    console.log(`🔄 Syncing repository ${ipAssetId}...`);
    const repository = await blockchainSync.syncRepository(ipAssetId);
    
    res.json({
      success: true,
      message: 'Repository synced from blockchain',
      repository,
      source: 'blockchain',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Sync all repositories for a user
// @route   POST /api/sync/user/:address
// @access  Public
router.post('/user/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    console.log(`🔄 Syncing repositories for ${address}...`);
    const repositories = await blockchainSync.syncUserRepositories(address);
    
    res.json({
      success: true,
      message: `Synced ${repositories.length} repositories`,
      count: repositories.length,
      repositories,
      source: 'blockchain',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Rebuild entire cache from blockchain (EXPENSIVE!)
// @route   POST /api/sync/rebuild
// @access  Admin only (should add auth middleware)
router.post('/rebuild', async (req, res) => {
  try {
    const { confirm } = req.body;
    
    if (confirm !== 'REBUILD_CACHE') {
      return res.status(400).json({
        success: false,
        error: 'Confirmation required',
        hint: 'Send { "confirm": "REBUILD_CACHE" } in request body',
      });
    }
    
    // Check if sync already in progress
    const status = blockchainSync.getStatus();
    if (status.currentlySyncing) {
      return res.status(409).json({
        success: false,
        error: 'Sync already in progress',
      });
    }
    
    // Start rebuild (async - don't wait)
    blockchainSync.rebuildCache().catch(error => {
      console.error('❌ Cache rebuild error:', error);
    });
    
    res.json({
      success: true,
      message: 'Cache rebuild started',
      warning: 'This is an expensive operation. Check /api/sync/status for progress.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Get cache statistics
// @route   GET /api/sync/stats
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalRepos = await Repository.countDocuments();
    const verifiedRepos = await Repository.countDocuments({ blockchainVerified: true });
    const recentlySync = await Repository.countDocuments({
      lastSyncedAt: { $gte: new Date(Date.now() - 3600000) } // Last hour
    });
    
    const oldestSync = await Repository.findOne()
      .sort({ lastSyncedAt: 1 })
      .select('lastSyncedAt repoId');
    
    res.json({
      success: true,
      stats: {
        totalCached: totalRepos,
        blockchainVerified: verifiedRepos,
        syncedLastHour: recentlySync,
        oldestCacheEntry: oldestSync,
      },
      note: 'Cache entries auto-expire after 30 days (TTL)',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Manually invalidate cache entry
// @route   DELETE /api/sync/cache/:repoId
// @access  Public
router.delete('/cache/:repoId', async (req, res) => {
  try {
    const { repoId } = req.params;
    
    const result = await Repository.deleteOne({ repoId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Repository not found in cache',
      });
    }
    
    res.json({
      success: true,
      message: 'Cache entry deleted',
      note: 'Repository still exists on blockchain. Sync to restore.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
