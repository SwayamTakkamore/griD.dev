// Emergency Blockchain-Only Mode
// Fallback when MongoDB cache fails - operates directly from blockchain

const { getStoryClient } = require('../config/story');

class EmergencyBlockchainMode {
  constructor() {
    this.storyClient = null;
    this.isActive = false;
  }

  /**
   * Activate emergency mode
   */
  activate() {
    console.log('🚨 EMERGENCY MODE ACTIVATED - Operating blockchain-only');
    this.storyClient = getStoryClient();
    this.isActive = true;
    
    if (!this.storyClient) {
      throw new Error('Cannot activate emergency mode: Story Protocol client unavailable');
    }
  }

  /**
   * Deactivate emergency mode
   */
  deactivate() {
    console.log('✅ Emergency mode deactivated - Resuming normal cache operations');
    this.isActive = false;
  }

  /**
   * Get repository directly from blockchain (no cache)
   */
  async getRepository(ipAssetId) {
    if (!this.isActive) {
      throw new Error('Emergency mode not active');
    }

    try {
      console.log(`🔍 [EMERGENCY] Fetching ${ipAssetId} from blockchain...`);
      
      const ipAsset = await this.storyClient.ipAsset.get(ipAssetId);
      
      if (!ipAsset) {
        return null;
      }

      // Transform blockchain data to app format
      return {
        ipAssetId: ipAssetId,
        title: ipAsset.name || 'Untitled',
        description: ipAsset.description || '',
        owner: ipAsset.owner || ipAsset.creator,
        ipfsCid: ipAsset.metadataURI || ipAsset.contentHash,
        licenseType: this.parseLicenseType(ipAsset.licenseTerms),
        ipAssetRegistered: true,
        createdAt: ipAsset.createdAt || new Date(),
        blockchainVerified: true,
        cacheSource: 'emergency_blockchain',
        emergencyMode: true,
      };
    } catch (error) {
      console.error(`❌ [EMERGENCY] Error fetching repository:`, error.message);
      throw error;
    }
  }

  /**
   * Get all repositories for a user (blockchain only)
   */
  async getUserRepositories(ownerAddress) {
    if (!this.isActive) {
      throw new Error('Emergency mode not active');
    }

    try {
      console.log(`🔍 [EMERGENCY] Fetching repos for ${ownerAddress} from blockchain...`);
      
      const ipAssets = await this.storyClient.ipAsset.getByOwner(ownerAddress);
      
      if (!ipAssets || ipAssets.length === 0) {
        return [];
      }

      // Transform all assets
      const repositories = ipAssets.map(asset => ({
        ipAssetId: asset.id,
        title: asset.name || 'Untitled',
        description: asset.description || '',
        owner: asset.owner || asset.creator,
        ipfsCid: asset.metadataURI || asset.contentHash,
        licenseType: this.parseLicenseType(asset.licenseTerms),
        ipAssetRegistered: true,
        createdAt: asset.createdAt || new Date(),
        blockchainVerified: true,
        cacheSource: 'emergency_blockchain',
        emergencyMode: true,
      }));

      console.log(`✅ [EMERGENCY] Found ${repositories.length} repositories on blockchain`);
      return repositories;
    } catch (error) {
      console.error(`❌ [EMERGENCY] Error fetching user repos:`, error.message);
      throw error;
    }
  }

  /**
   * Search repositories on blockchain (limited functionality)
   */
  async searchRepositories(query) {
    if (!this.isActive) {
      throw new Error('Emergency mode not active');
    }

    console.warn('⚠️  [EMERGENCY] Blockchain search is limited. Consider restoring cache.');
    
    // In emergency mode, we can't do full-text search
    // Return empty array or implement basic search if Story Protocol supports it
    return [];
  }

  /**
   * Helper: Parse license type
   */
  parseLicenseType(licenseTerms) {
    if (!licenseTerms) return 'open';
    
    if (licenseTerms.includes('commercial') || licenseTerms.includes('paid')) {
      return 'paid';
    } else if (licenseTerms.includes('restricted') || licenseTerms.includes('approval')) {
      return 'restricted';
    }
    
    return 'open';
  }

  /**
   * Check if emergency mode is active
   */
  isEmergencyMode() {
    return this.isActive;
  }

  /**
   * Get status
   */
  getStatus() {
    return {
      active: this.isActive,
      client: !!this.storyClient,
      warning: this.isActive ? 'Operating in emergency blockchain-only mode' : null,
    };
  }
}

// Singleton instance
const emergencyMode = new EmergencyBlockchainMode();

/**
 * Middleware to automatically activate emergency mode if MongoDB fails
 */
const emergencyModeMiddleware = async (req, res, next) => {
  // Check if MongoDB is accessible
  const mongoose = require('mongoose');
  
  if (mongoose.connection.readyState !== 1) {
    console.warn('⚠️  MongoDB connection lost - Activating emergency mode');
    
    try {
      emergencyMode.activate();
      req.emergencyMode = true;
    } catch (error) {
      return res.status(503).json({
        success: false,
        error: 'Database unavailable and blockchain fallback failed',
        details: error.message,
      });
    }
  }
  
  next();
};

module.exports = { emergencyMode, emergencyModeMiddleware };
