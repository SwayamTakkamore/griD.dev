// Blockchain Sync Service
// Syncs Story Protocol blockchain data to MongoDB cache
// MongoDB is ONLY a cache - blockchain is source of truth

const { getStoryClient } = require('../config/story');
const Repository = require('../models/Repository');
const User = require('../models/User');

class BlockchainSyncService {
  constructor() {
    this.storyClient = null;
    this.syncInterval = null;
    this.isSyncing = false;
  }

  /**
   * Initialize sync service
   */
  async initialize() {
    try {
      this.storyClient = getStoryClient();
      
      if (!this.storyClient) {
        console.warn('⚠️  Story Protocol client not available. Sync service disabled.');
        return false;
      }

      console.log('✅ Blockchain Sync Service initialized');
      return true;
    } catch (error) {
      console.error('❌ Blockchain Sync Service initialization error:', error.message);
      return false;
    }
  }

  /**
   * Sync a single repository from blockchain to cache
   * @param {string} ipAssetId - Story Protocol IP Asset ID
   */
  async syncRepository(ipAssetId) {
    try {
      if (!this.storyClient) {
        throw new Error('Story Protocol client not initialized');
      }

      console.log(`🔄 Syncing repository ${ipAssetId} from blockchain...`);

      // Fetch IP Asset data from Story Protocol
      const ipAsset = await this.storyClient.ipAsset.get(ipAssetId);
      
      if (!ipAsset) {
        throw new Error(`IP Asset ${ipAssetId} not found on blockchain`);
      }

      // Parse metadata from blockchain
      const metadata = {
        ipAssetId: ipAssetId,
        owner: ipAsset.owner || ipAsset.creator,
        ipfsCid: ipAsset.metadataURI || ipAsset.contentHash,
        title: ipAsset.name || 'Untitled Repository',
        description: ipAsset.description || '',
        licenseType: this.parseLicenseType(ipAsset.licenseTerms),
        ipAssetRegistered: true,
        lastSyncedAt: new Date(),
        cacheSource: 'blockchain',
      };

      // Update or create cache entry
      const cachedRepo = await Repository.findOneAndUpdate(
        { ipAssetId },
        {
          ...metadata,
          $set: { lastSyncedAt: new Date() }
        },
        { upsert: true, new: true }
      );

      console.log(`✅ Repository ${ipAssetId} synced to cache`);
      return cachedRepo;

    } catch (error) {
      console.error(`❌ Error syncing repository ${ipAssetId}:`, error.message);
      throw error;
    }
  }

  /**
   * Sync multiple repositories by owner address
   * @param {string} ownerAddress - Wallet address
   */
  async syncUserRepositories(ownerAddress) {
    try {
      if (!this.storyClient) {
        throw new Error('Story Protocol client not initialized');
      }

      console.log(`🔄 Syncing repositories for ${ownerAddress}...`);

      // Query blockchain for all IP Assets owned by address
      const ipAssets = await this.storyClient.ipAsset.getByOwner(ownerAddress);

      if (!ipAssets || ipAssets.length === 0) {
        console.log(`No repositories found for ${ownerAddress} on blockchain`);
        return [];
      }

      // Sync each repository
      const syncPromises = ipAssets.map(asset => this.syncRepository(asset.id));
      const syncedRepos = await Promise.all(syncPromises);

      console.log(`✅ Synced ${syncedRepos.length} repositories for ${ownerAddress}`);
      return syncedRepos;

    } catch (error) {
      console.error(`❌ Error syncing user repositories:`, error.message);
      throw error;
    }
  }

  /**
   * Verify cache entry against blockchain
   * @param {string} ipAssetId - IP Asset ID to verify
   */
  async verifyCache(ipAssetId) {
    try {
      // Get cached data
      const cachedRepo = await Repository.findOne({ ipAssetId });
      
      if (!cachedRepo) {
        return {
          verified: false,
          reason: 'Not found in cache',
          action: 'sync_required'
        };
      }

      // Get blockchain data
      const blockchainData = await this.storyClient.ipAsset.get(ipAssetId);

      if (!blockchainData) {
        return {
          verified: false,
          reason: 'Not found on blockchain',
          action: 'remove_from_cache'
        };
      }

      // Compare critical fields
      const ownerMatch = cachedRepo.owner.toLowerCase() === blockchainData.owner.toLowerCase();
      const cidMatch = cachedRepo.ipfsCid === (blockchainData.metadataURI || blockchainData.contentHash);

      if (!ownerMatch || !cidMatch) {
        return {
          verified: false,
          reason: 'Cache mismatch with blockchain',
          action: 'resync_required',
          differences: {
            owner: !ownerMatch,
            cid: !cidMatch
          }
        };
      }

      return {
        verified: true,
        lastSynced: cachedRepo.lastSyncedAt,
        blockchainSource: true
      };

    } catch (error) {
      console.error(`❌ Error verifying cache:`, error.message);
      return {
        verified: false,
        reason: error.message,
        action: 'error'
      };
    }
  }

  /**
   * Full cache rebuild from blockchain
   * Use with caution - expensive operation
   */
  async rebuildCache() {
    try {
      console.log('🔄 Starting full cache rebuild from blockchain...');
      this.isSyncing = true;

      // Get all unique owner addresses from current cache
      const uniqueOwners = await Repository.distinct('owner');

      console.log(`Found ${uniqueOwners.length} unique owners to sync`);

      // Sync repositories for each owner
      for (const owner of uniqueOwners) {
        await this.syncUserRepositories(owner);
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('✅ Cache rebuild complete');
      this.isSyncing = false;

    } catch (error) {
      console.error('❌ Cache rebuild failed:', error.message);
      this.isSyncing = false;
      throw error;
    }
  }

  /**
   * Start automatic sync service (runs every 5 minutes)
   */
  startAutoSync(intervalMs = 5 * 60 * 1000) {
    if (this.syncInterval) {
      console.log('⚠️  Auto-sync already running');
      return;
    }

    console.log(`🔄 Starting auto-sync service (interval: ${intervalMs / 1000}s)`);

    this.syncInterval = setInterval(async () => {
      if (this.isSyncing) {
        console.log('⏭️  Skipping sync - already in progress');
        return;
      }

      try {
        await this.rebuildCache();
      } catch (error) {
        console.error('❌ Auto-sync error:', error.message);
      }
    }, intervalMs);
  }

  /**
   * Stop automatic sync service
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('⏹️  Auto-sync stopped');
    }
  }

  /**
   * Helper: Parse license type from Story Protocol terms
   */
  parseLicenseType(licenseTerms) {
    if (!licenseTerms) return 'open';
    
    // Parse Story Protocol license terms
    if (licenseTerms.includes('commercial') || licenseTerms.includes('paid')) {
      return 'paid';
    } else if (licenseTerms.includes('restricted') || licenseTerms.includes('approval')) {
      return 'restricted';
    }
    
    return 'open';
  }

  /**
   * Get sync status
   */
  getStatus() {
    return {
      initialized: !!this.storyClient,
      autoSyncRunning: !!this.syncInterval,
      currentlySyncing: this.isSyncing,
    };
  }
}

// Singleton instance
const blockchainSyncService = new BlockchainSyncService();

module.exports = blockchainSyncService;
