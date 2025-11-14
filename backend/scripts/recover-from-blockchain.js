#!/usr/bin/env node

/**
 * Recovery Script - Rebuild MongoDB from Blockchain
 * 
 * Use this script when:
 * - MongoDB data is lost or corrupted
 * - Need to verify data integrity
 * - Migrating to new database
 * 
 * Usage:
 *   node scripts/recover-from-blockchain.js [fromBlock]
 * 
 * Example:
 *   node scripts/recover-from-blockchain.js 0
 *   node scripts/recover-from-blockchain.js 1000000
 */

require('dotenv').config();
const mongoose = require('mongoose');
const blockchainIndexer = require('../src/services/blockchainIndexer');
const connectDB = require('../src/config/database');

async function recover(fromBlock = 0) {
  try {
    console.log('🔄 Starting recovery from blockchain...\n');

    // Connect to database
    console.log('📊 Connecting to MongoDB...');
    await connectDB();

    // Initialize blockchain indexer
    console.log('🔗 Connecting to blockchain...');
    const initialized = await blockchainIndexer.initialize();
    
    if (!initialized) {
      console.error('❌ Failed to initialize blockchain indexer');
      console.log('\n💡 Make sure:');
      console.log('   1. Contract is deployed');
      console.log('   2. REPOSITORY_CONTRACT_ADDRESS is set in .env');
      console.log('   3. Contract ABI exists in frontend/contracts/');
      process.exit(1);
    }

    // Confirmation prompt
    console.log('\n⚠️  WARNING: This will sync all blockchain data to MongoDB');
    console.log(`📍 Starting from block: ${fromBlock}`);
    console.log('📝 Existing records will be skipped');
    console.log('\n⏳ This may take a while depending on blockchain size...\n');

    // Sync historical events
    await blockchainIndexer.syncHistoricalEvents(fromBlock);

    console.log('\n✅ Recovery complete!');
    console.log('📊 Database has been rebuilt from blockchain');
    console.log('\n💡 Tips:');
    console.log('   - Verify data in MongoDB');
    console.log('   - Check repository counts');
    console.log('   - Test frontend functionality');
    console.log('   - Start backend server normally');

  } catch (error) {
    console.error('\n❌ Recovery failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    // Cleanup
    blockchainIndexer.stopListening();
    await mongoose.connection.close();
    console.log('\n👋 Connection closed');
    process.exit(0);
  }
}

// Get starting block from command line
const fromBlock = parseInt(process.argv[2]) || 0;

// Run recovery
recover(fromBlock);
