const { uploadToPinata, uploadJSONToPinata } = require('../../utils/pinata');
const fs = require('fs');

class IPFSService {
  constructor() {
    this.gateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
  }

  // Upload file to IPFS using Pinata
  async uploadFile(filePath, fileName) {
    try {
      // Read file
      const fileBuffer = fs.readFileSync(filePath);
      
      // Upload to Pinata
      const result = await uploadToPinata(fileBuffer, fileName, {
        type: 'repository',
        uploadedAt: new Date().toISOString(),
      });

      console.log(`✅ File uploaded to IPFS via Pinata: ${result.cid}`);

      return {
        cid: result.cid,
        url: result.ipfsUrl,
        path: fileName,
        size: fileBuffer.length,
      };
    } catch (error) {
      console.error('❌ IPFS upload error:', error.message);
      throw new Error(`Failed to upload to IPFS: ${error.message}`);
    }
  }

  // Upload buffer to IPFS using Pinata
  async uploadBuffer(buffer, fileName) {
    try {
      // Upload to Pinata
      const result = await uploadToPinata(buffer, fileName, {
        type: 'repository',
        uploadedAt: new Date().toISOString(),
      });

      console.log(`✅ Buffer uploaded to IPFS via Pinata: ${result.cid}`);

      return {
        cid: result.cid,
        url: result.ipfsUrl,
        path: fileName,
        size: buffer.length,
      };
    } catch (error) {
      console.error('❌ IPFS buffer upload error:', error.message);
      throw new Error(`Failed to upload buffer to IPFS: ${error.message}`);
    }
  }

  // Upload JSON metadata to IPFS using Pinata
  async uploadMetadata(metadata) {
    try {
      // Upload to Pinata
      const result = await uploadJSONToPinata(metadata, 'metadata.json');

      console.log(`✅ Metadata uploaded to IPFS via Pinata: ${result.cid}`);

      return {
        cid: result.cid,
        url: result.ipfsUrl,
        size: JSON.stringify(metadata).length,
      };
    } catch (error) {
      console.error('❌ IPFS metadata upload error:', error.message);
      throw new Error(`Failed to upload metadata to IPFS: ${error.message}`);
    }
  }

  // Get file from IPFS
  async getFile(cid) {
    try {
      const client = this.initClient();
      
      const chunks = [];
      for await (const chunk of client.cat(cid)) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      console.error('❌ IPFS get file error:', error.message);
      throw new Error(`Failed to get file from IPFS: ${error.message}`);
    }
  }

  // Pin file to ensure it stays on IPFS
  async pinFile(cid) {
    try {
      const client = this.initClient();
      await client.pin.add(cid);
      console.log(`✅ Pinned to IPFS: ${cid}`);
      return true;
    } catch (error) {
      console.error('❌ IPFS pin error:', error.message);
      // Don't throw error, pinning is optional
      return false;
    }
  }

  // Get gateway URL for CID
  getGatewayUrl(cid) {
    return `${this.gateway}${cid}`;
  }
}

module.exports = new IPFSService();
