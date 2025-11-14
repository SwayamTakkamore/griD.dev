// Story Protocol SDK Configuration
const { StoryClient, StoryConfig } = require('@story-protocol/core-sdk');
const { http } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

let storyClient = null;

const initStoryClient = () => {
  try {
    const rpcUrl = process.env.STORY_RPC_URL || 'https://aeneid.storyrpc.io';
    const network = process.env.STORY_NETWORK || 'aeneid';
    const privateKey = process.env.BACKEND_PRIVATE_KEY;

    if (!rpcUrl) {
      console.warn('⚠️  Story Protocol RPC URL not found. Story features will be disabled.');
      return null;
    }

    // Check if private key is available (optional for read-only operations)
    if (!privateKey) {
      console.warn('⚠️  Backend private key not found. Story Protocol features will be limited to read-only operations.');
      console.log('💡 Add BACKEND_PRIVATE_KEY to .env for full Story Protocol functionality');
      return null;
    }

    // Create account from private key
    const account = privateKeyToAccount(privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`);

    // Configure Story Protocol SDK
    const config = {
      account: account,
      transport: http(rpcUrl),
      chainId: network, // 'aeneid' for testnet
    };

    // Initialize Story Client
    storyClient = StoryClient.newClient(config);

    console.log('✅ Story Protocol Client initialized');
    return storyClient;
  } catch (error) {
    console.error('❌ Story Protocol initialization error:', error.message);
    console.log('💡 Story Protocol is optional. The app will work without it for now.');
    return null;
  }
};

const getStoryClient = () => {
  if (!storyClient) {
    storyClient = initStoryClient();
  }
  return storyClient;
};

module.exports = { getStoryClient, initStoryClient };
