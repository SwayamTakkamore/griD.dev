// Onchain Storage Service - 100% Blockchain + IPFS
// NO MongoDB - Story Protocol is the ONLY database

const { getStoryClient } = require('../config/story');
const ipfsService = require('./ipfsService');

class OnchainStorageService {
  constructor() {
    this.storyClient = null;
  }

  /**
   * Initialize Story Protocol client
   */
  async initialize() {
    try {
      this.storyClient = getStoryClient();
      
      if (!this.storyClient) {
        throw new Error('Story Protocol client not available');
      }

      console.log('✅ Onchain Storage Service initialized - 100% Decentralized');
      return true;
    } catch (error) {
      console.error('❌ Onchain Storage initialization error:', error.message);
      throw error;
    }
  }

  /**
   * Create repository - Stores everything onchain + IPFS
   * @returns {Object} - { ipAssetId, ipfsCid, txHash }
   */
  async createRepository(data) {
    try {
      const { title, description, file, owner, licenseType, tags } = data;

      console.log('📦 Creating 100% onchain repository...');

      // Step 1: Upload code to IPFS
      console.log('📤 Uploading to IPFS...');
      const ipfsResult = await ipfsService.uploadBuffer(file.data, file.name);

      // Step 2: Create metadata object
      const metadata = {
        title,
        description,
        owner,
        licenseType: licenseType || 'open',
        tags: tags || [],
        fileName: file.name,
        fileSize: file.size,
        fileType: file.mimetype,
        codeCID: ipfsResult.cid,
        createdAt: new Date().toISOString(),
        version: '1.0.0',
      };

      // Step 3: Upload metadata to IPFS
      console.log('📤 Uploading metadata to IPFS...');
      const metadataBuffer = Buffer.from(JSON.stringify(metadata, null, 2));
      const metadataResult = await ipfsService.uploadBuffer(
        metadataBuffer,
        `${title.replace(/\s+/g, '-')}-metadata.json`
      );

      // Step 4: Register IP Asset on Story Protocol
      console.log('📝 Registering IP Asset on Story Protocol...');
      const ipAsset = await this.storyClient.ipAsset.register({
        name: title,
        description: description,
        ipMetadata: {
          metadataURI: `ipfs://${metadataResult.cid}`,
          metadataHash: metadataResult.cid,
        },
        owner: owner,
      });

      if (!ipAsset || !ipAsset.ipAssetId) {
        throw new Error('Failed to register IP Asset');
      }

      console.log(`✅ IP Asset registered: ${ipAsset.ipAssetId}`);

      // Step 5: Attach license terms
      if (licenseType) {
        console.log('🔐 Attaching license terms...');
        await this.attachLicense(ipAsset.ipAssetId, licenseType);
      }

      return {
        ipAssetId: ipAsset.ipAssetId,
        txHash: ipAsset.txHash,
        metadataCID: metadataResult.cid,
        codeCID: ipfsResult.cid,
        ipfsUrl: ipfsResult.url,
        blockNumber: ipAsset.blockNumber,
        timestamp: new Date().toISOString(),
      };

    } catch (error) {
      console.error('❌ Create repository error:', error);
      throw error;
    }
  }

  /**
   * Get repository - Fetch from blockchain + IPFS only
   */
  async getRepository(ipAssetId) {
    try {
      console.log(`🔍 Fetching repository ${ipAssetId} from blockchain...`);

      // Fetch IP Asset from Story Protocol
      const ipAsset = await this.storyClient.ipAsset.get(ipAssetId);

      if (!ipAsset) {
        throw new Error('Repository not found on blockchain');
      }

      // Fetch metadata from IPFS
      let metadata = {};
      if (ipAsset.metadataURI) {
        const metadataCID = ipAsset.metadataURI.replace('ipfs://', '');
        console.log(`📥 Fetching metadata from IPFS: ${metadataCID}`);
        
        try {
          const metadataContent = await ipfsService.getFromIPFS(metadataCID);
          metadata = JSON.parse(metadataContent);
        } catch (error) {
          console.warn('⚠️  Could not fetch metadata from IPFS:', error.message);
        }
      }

      // Combine blockchain + IPFS data
      return {
        ipAssetId: ipAssetId,
        title: ipAsset.name || metadata.title || 'Untitled',
        description: ipAsset.description || metadata.description || '',
        owner: ipAsset.owner || metadata.owner,
        licenseType: metadata.licenseType || 'open',
        tags: metadata.tags || [],
        fileName: metadata.fileName,
        fileSize: metadata.fileSize,
        fileType: metadata.fileType,
        codeCID: metadata.codeCID,
        metadataCID: ipAsset.metadataURI?.replace('ipfs://', ''),
        ipfsUrl: `https://ipfs.io/ipfs/${metadata.codeCID}`,
        createdAt: metadata.createdAt || ipAsset.blockTimestamp,
        blockNumber: ipAsset.blockNumber,
        txHash: ipAsset.txHash,
        verified: true,
        source: 'blockchain',
      };

    } catch (error) {
      console.error('❌ Get repository error:', error);
      throw error;
    }
  }

  /**
   * Get all repositories by owner
   */
  async getUserRepositories(ownerAddress) {
    try {
      console.log(`🔍 Fetching repositories for ${ownerAddress} from blockchain...`);

      // Query Story Protocol for all IP Assets owned by address
      const ipAssets = await this.storyClient.ipAsset.getByOwner(ownerAddress);

      if (!ipAssets || ipAssets.length === 0) {
        console.log('No repositories found on blockchain');
        return [];
      }

      // Fetch full details for each repository
      const repositories = await Promise.all(
        ipAssets.map(asset => this.getRepository(asset.id))
      );

      console.log(`✅ Found ${repositories.length} repositories on blockchain`);
      return repositories;

    } catch (error) {
      console.error('❌ Get user repositories error:', error);
      throw error;
    }
  }

  /**
   * Search repositories (limited on blockchain)
   */
  async searchRepositories(query) {
    try {
      console.log(`🔍 Searching repositories for: ${query}`);

      // Note: Blockchain search is limited
      // We can only search by indexed fields
      // For full-text search, consider using The Graph or similar indexer

      // For now, return empty array
      // You can implement The Graph subgraph for advanced search
      console.warn('⚠️  Blockchain search not fully implemented. Consider using The Graph.');
      
      return [];

    } catch (error) {
      console.error('❌ Search error:', error);
      throw error;
    }
  }

  /**
   * Attach license to IP Asset
   */
  async attachLicense(ipAssetId, licenseType) {
    try {
      console.log(`🔐 Attaching ${licenseType} license to ${ipAssetId}...`);

      // Map license types to Story Protocol license terms
      const licenseTerms = this.getLicenseTerms(licenseType);

      await this.storyClient.license.attach({
        ipAssetId,
        licenseTerms,
      });

      console.log('✅ License attached');
      return true;

    } catch (error) {
      console.error('❌ Attach license error:', error);
      throw error;
    }
  }

  /**
   * Get license terms for different types
   */
  getLicenseTerms(licenseType) {
    switch (licenseType) {
      case 'open':
        return {
          commercial: true,
          derivatives: true,
          attribution: true,
          royalty: 0,
        };
      case 'restricted':
        return {
          commercial: false,
          derivatives: true,
          attribution: true,
          royalty: 0,
        };
      case 'paid':
        return {
          commercial: true,
          derivatives: true,
          attribution: true,
          royalty: 5, // 5% royalty
        };
      default:
        return {
          commercial: true,
          derivatives: true,
          attribution: true,
          royalty: 0,
        };
    }
  }

  /**
   * Get user profile (from blockchain)
   */
  async getUserProfile(walletAddress) {
    try {
      // Fetch user's repositories
      const repositories = await this.getUserRepositories(walletAddress);

      // Create profile from onchain data
      return {
        walletAddress: walletAddress.toLowerCase(),
        repositoryCount: repositories.length,
        repositories: repositories.map(r => r.ipAssetId),
        joinedAt: repositories[0]?.createdAt || new Date().toISOString(),
        totalContributions: repositories.length,
        verified: true,
        source: 'blockchain',
      };

    } catch (error) {
      console.error('❌ Get user profile error:', error);
      throw error;
    }
  }

  /**
   * Update user bio (store on IPFS, reference onchain)
   */
  async updateUserBio(walletAddress, bio) {
    try {
      console.log(`📝 Updating bio for ${walletAddress}...`);

      // Create user profile metadata
      const profileMetadata = {
        walletAddress: walletAddress.toLowerCase(),
        bio: bio,
        updatedAt: new Date().toISOString(),
      };

      // Upload to IPFS
      const metadataBuffer = Buffer.from(JSON.stringify(profileMetadata, null, 2));
      const ipfsResult = await ipfsService.uploadBuffer(
        metadataBuffer,
        `${walletAddress}-profile.json`
      );

      console.log(`✅ Bio stored on IPFS: ${ipfsResult.cid}`);

      // Store CID reference somewhere accessible
      // Could be in a smart contract or as part of user's first IP Asset metadata
      return {
        success: true,
        ipfsCID: ipfsResult.cid,
        ipfsUrl: ipfsResult.url,
      };

    } catch (error) {
      console.error('❌ Update bio error:', error);
      throw error;
    }
  }
}

// Singleton instance
const onchainStorage = new OnchainStorageService();

module.exports = onchainStorage;
