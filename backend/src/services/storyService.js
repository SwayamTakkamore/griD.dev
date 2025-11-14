const { getStoryClient } = require('../config/story');

class StoryService {
  constructor() {
    this.client = null;
  }

  // Initialize Story Protocol client
  initClient() {
    if (!this.client) {
      this.client = getStoryClient();
    }
    return this.client;
  }

  // Register IP Asset on Story Protocol
  async registerIPAsset(metadata) {
    try {
      const client = this.initClient();

      if (!client) {
        console.warn('⚠️  Story Protocol client not available. Skipping IP registration.');
        return {
          ipAssetId: `mock_ip_${Date.now()}`,
          txHash: `0x${Math.random().toString(16).substr(2)}`,
          registered: false,
          message: 'Story Protocol client not configured',
        };
      }

      // Prepare IP metadata
      const ipMetadata = {
        name: metadata.title,
        description: metadata.description,
        ipType: 'SOFTWARE',
        contentHash: metadata.ipfsCid,
        uri: metadata.ipfsUrl,
        creator: metadata.owner,
        createdAt: new Date().toISOString(),
      };

      console.log('📝 Registering IP Asset on Story Protocol...');

      // Register IP Asset
      // Note: This is a placeholder - actual implementation depends on Story SDK version
      const result = await client.ipAsset.register({
        metadata: ipMetadata,
        owner: metadata.owner,
      });

      console.log(`✅ IP Asset registered: ${result.ipAssetId}`);

      return {
        ipAssetId: result.ipAssetId,
        txHash: result.txHash,
        registered: true,
        blockNumber: result.blockNumber,
      };
    } catch (error) {
      console.error('❌ Story Protocol registration error:', error.message);
      
      // Return mock data in case of error to allow development without Story Protocol
      return {
        ipAssetId: `mock_ip_${Date.now()}`,
        txHash: `0x${Math.random().toString(16).substr(2)}`,
        registered: false,
        error: error.message,
      };
    }
  }

  // Get IP Asset details
  async getIPAsset(ipAssetId) {
    try {
      const client = this.initClient();

      if (!client) {
        throw new Error('Story Protocol client not available');
      }

      const result = await client.ipAsset.get(ipAssetId);
      return result;
    } catch (error) {
      console.error('❌ Failed to get IP Asset:', error.message);
      throw new Error(`Failed to get IP Asset: ${error.message}`);
    }
  }

  // Attach license to IP Asset
  async attachLicense(ipAssetId, licenseType) {
    try {
      const client = this.initClient();

      if (!client) {
        console.warn('⚠️  Story Protocol client not available');
        return { success: false, message: 'Client not configured' };
      }

      // Map license type to Story Protocol license terms
      const licenseTerms = this.mapLicenseType(licenseType);

      const result = await client.license.attach({
        ipAssetId,
        licenseTerms,
      });

      console.log(`✅ License attached to IP Asset: ${ipAssetId}`);

      return {
        success: true,
        licenseId: result.licenseId,
        txHash: result.txHash,
      };
    } catch (error) {
      console.error('❌ Failed to attach license:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Map license type to Story Protocol terms
  mapLicenseType(licenseType) {
    const licenseMap = {
      'open': {
        commercial: false,
        derivatives: true,
        attribution: true,
      },
      'restricted': {
        commercial: false,
        derivatives: false,
        attribution: true,
      },
      'paid': {
        commercial: true,
        derivatives: true,
        attribution: true,
        royaltyPercentage: 10, // 10% royalty
      },
    };

    return licenseMap[licenseType] || licenseMap['open'];
  }

  // Track contribution on Story Protocol
  async trackContribution(ipAssetId, contributorAddress, contributionData) {
    try {
      const client = this.initClient();

      if (!client) {
        console.warn('⚠️  Story Protocol client not available');
        return { success: false };
      }

      // Record contribution on-chain
      const result = await client.ipAsset.addContributor({
        ipAssetId,
        contributor: contributorAddress,
        contribution: contributionData,
      });

      console.log(`✅ Contribution tracked for IP Asset: ${ipAssetId}`);

      return {
        success: true,
        txHash: result.txHash,
      };
    } catch (error) {
      console.error('❌ Failed to track contribution:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Verify IP ownership
  async verifyOwnership(ipAssetId, walletAddress) {
    try {
      const client = this.initClient();

      if (!client) {
        throw new Error('Story Protocol client not available');
      }

      const ipAsset = await client.ipAsset.get(ipAssetId);
      return ipAsset.owner.toLowerCase() === walletAddress.toLowerCase();
    } catch (error) {
      console.error('❌ Failed to verify ownership:', error.message);
      throw new Error(`Failed to verify ownership: ${error.message}`);
    }
  }
}

module.exports = new StoryService();
