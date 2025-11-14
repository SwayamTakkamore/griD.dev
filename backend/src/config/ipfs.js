// IPFS client configuration using Pinata
const { pinata } = require('../../utils/pinata');

// Get IPFS client (Pinata)
const getIPFSClient = () => {
  try {
    const pinataJwt = process.env.PINATA_JWT;

    if (!pinataJwt) {
      console.warn('⚠️  Pinata JWT not found. IPFS features will be disabled.');
      return null;
    }

    console.log('✅ IPFS Client (Pinata) initialized');
    return pinata;
  } catch (error) {
    console.error('❌ IPFS Client initialization error:', error.message);
    return null;
  }
};

module.exports = { getIPFSClient };
