const { ethers } = require('ethers');
const Repository = require('../models/Repository');
const fs = require('fs');
const path = require('path');

class BlockchainIndexer {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.isRunning = false;
    this.contractAddress = process.env.REPOSITORY_CONTRACT_ADDRESS;
  }

  /**
   * Initialize blockchain connection and contract
   */
  async initialize() {
    try {
      if (!this.contractAddress) {
        console.log('⚠️  Repository contract not deployed yet. Indexer disabled.');
        return false;
      }

      // Connect to Story Aeneid RPC
      this.provider = new ethers.JsonRpcProvider(process.env.STORY_RPC_URL);

      // Load contract ABI
      const abiPath = path.join(__dirname, '../../../frontend/contracts/RepositoryRegistry.json');
      
      if (!fs.existsSync(abiPath)) {
        console.log('⚠️  Contract ABI not found. Deploy contract first.');
        return false;
      }

      const contractData = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
      this.contract = new ethers.Contract(
        this.contractAddress,
        contractData.abi,
        this.provider
      );

      console.log('✅ Blockchain indexer initialized');
      console.log('📝 Contract address:', this.contractAddress);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize blockchain indexer:', error.message);
      return false;
    }
  }

  /**
   * Start listening to blockchain events
   */
  async startListening() {
    if (!this.contract) {
      console.log('Blockchain indexer not initialized');
      return;
    }

    if (this.isRunning) {
      console.log('Indexer already running');
      return;
    }

    this.isRunning = true;
    console.log('👂 Listening for blockchain events...');

    // Listen to RepositoryCreated events
    this.contract.on('RepositoryCreated', async (repoId, ipfsCid, owner, storyIpId, timestamp, event) => {
      try {
        console.log(`📥 New repository on-chain: ${repoId}`);
        
        // Check if already indexed
        const existing = await Repository.findOne({ repoId });
        if (existing) {
          console.log(`ℹ️  Repository ${repoId} already in database`);
          return;
        }

        // Index to MongoDB (as cache)
        const repository = new Repository({
          repoId,
          ipfsCid,
          owner: owner.toLowerCase(),
          storyIpId: storyIpId || undefined,
          ipAssetId: storyIpId || undefined,
          ipAssetRegistered: !!storyIpId,
          ipfsUrl: `${process.env.IPFS_GATEWAY}/ipfs/${ipfsCid}`,
          title: `Repository ${repoId}`, // Will be updated from IPFS metadata
          description: 'Indexed from blockchain',
          licenseType: 'open',
          createdAt: new Date(Number(timestamp) * 1000),
        });

        await repository.save();
        console.log(`✅ Indexed repository ${repoId} to MongoDB`);

        // Optionally: Fetch metadata from IPFS and update
        await this.enrichRepositoryMetadata(repository);

      } catch (error) {
        console.error(`❌ Error indexing repository ${repoId}:`, error.message);
      }
    });

    // Listen to RepositoryUpdated events
    this.contract.on('RepositoryUpdated', async (repoId, newIpfsCid, newStoryIpId, timestamp) => {
      try {
        console.log(`🔄 Repository updated on-chain: ${repoId}`);

        await Repository.findOneAndUpdate(
          { repoId },
          {
            ipfsCid: newIpfsCid,
            ipfsUrl: `${process.env.IPFS_GATEWAY}/ipfs/${newIpfsCid}`,
            storyIpId: newStoryIpId,
            ipAssetId: newStoryIpId,
            updatedAt: new Date(Number(timestamp) * 1000),
          }
        );

        console.log(`✅ Updated repository ${repoId} in MongoDB`);
      } catch (error) {
        console.error(`❌ Error updating repository ${repoId}:`, error.message);
      }
    });

    // Listen to OwnershipTransferred events
    this.contract.on('OwnershipTransferred', async (repoId, previousOwner, newOwner, timestamp) => {
      try {
        console.log(`🔄 Ownership transferred: ${repoId} → ${newOwner}`);

        await Repository.findOneAndUpdate(
          { repoId },
          {
            owner: newOwner.toLowerCase(),
            updatedAt: new Date(Number(timestamp) * 1000),
          }
        );

        console.log(`✅ Updated ownership for ${repoId}`);
      } catch (error) {
        console.error(`❌ Error updating ownership ${repoId}:`, error.message);
      }
    });
  }

  /**
   * Stop listening to events
   */
  stopListening() {
    if (this.contract) {
      this.contract.removeAllListeners();
      this.isRunning = false;
      console.log('🛑 Stopped listening to blockchain events');
    }
  }

  /**
   * Fetch and enrich repository metadata from IPFS
   */
  async enrichRepositoryMetadata(repository) {
    try {
      // Fetch metadata from IPFS
      const response = await fetch(`${process.env.IPFS_GATEWAY}/ipfs/${repository.ipfsCid}`);
      
      if (!response.ok) {
        return;
      }

      // Check if it's JSON metadata
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const metadata = await response.json();
        
        // Update repository with metadata
        if (metadata.title) repository.title = metadata.title;
        if (metadata.description) repository.description = metadata.description;
        if (metadata.tags) repository.tags = metadata.tags;
        if (metadata.licenseType) repository.licenseType = metadata.licenseType;

        await repository.save();
        console.log(`📝 Enriched metadata for ${repository.repoId}`);
      }
    } catch (error) {
      // Silently fail - metadata enrichment is optional
      console.log(`ℹ️  Could not enrich metadata for ${repository.repoId}`);
    }
  }

  /**
   * Sync historical events (rebuild database from blockchain)
   */
  async syncHistoricalEvents(fromBlock = 0) {
    if (!this.contract) {
      console.log('Contract not initialized');
      return;
    }

    try {
      console.log('🔄 Syncing historical events from blockchain...');
      const currentBlock = await this.provider.getBlockNumber();
      console.log(`📊 Scanning blocks ${fromBlock} to ${currentBlock}`);

      // Query RepositoryCreated events
      const filter = this.contract.filters.RepositoryCreated();
      const events = await this.contract.queryFilter(filter, fromBlock, currentBlock);

      console.log(`📥 Found ${events.length} repository creation events`);

      for (const event of events) {
        const { repoId, ipfsCid, owner, storyIpId, timestamp } = event.args;

        // Check if already indexed
        const existing = await Repository.findOne({ repoId });
        if (existing) {
          console.log(`⏭️  Skipping ${repoId} (already indexed)`);
          continue;
        }

        // Index to database
        const repository = new Repository({
          repoId,
          ipfsCid,
          owner: owner.toLowerCase(),
          storyIpId: storyIpId || undefined,
          ipAssetId: storyIpId || undefined,
          ipAssetRegistered: !!storyIpId,
          ipfsUrl: `${process.env.IPFS_GATEWAY}/ipfs/${ipfsCid}`,
          title: `Repository ${repoId}`,
          description: 'Synced from blockchain',
          licenseType: 'open',
          createdAt: new Date(Number(timestamp) * 1000),
        });

        await repository.save();
        console.log(`✅ Synced ${repoId}`);

        // Enrich metadata
        await this.enrichRepositoryMetadata(repository);
      }

      console.log('✅ Historical sync complete');
    } catch (error) {
      console.error('❌ Error syncing historical events:', error.message);
    }
  }

  /**
   * Verify repository ownership on-chain
   */
  async verifyOwnership(repoId, address) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      return await this.contract.isOwner(repoId, address);
    } catch (error) {
      console.error('Error verifying ownership:', error);
      return false;
    }
  }
}

// Singleton instance
const indexer = new BlockchainIndexer();

module.exports = indexer;
