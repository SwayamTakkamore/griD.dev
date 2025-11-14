const { PinataSDK } = require("pinata-web3");
require('dotenv').config();

// Initialize Pinata client
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY || "gateway.pinata.cloud",
});

/**
 * Upload file to Pinata IPFS
 * @param {Buffer} fileBuffer - File buffer to upload
 * @param {string} fileName - Name of the file
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} - Upload result with CID
 */
const uploadToPinata = async (fileBuffer, fileName, metadata = {}) => {
  try {
    const blob = new Blob([fileBuffer]);
    const file = new File([blob], fileName, { type: "application/zip" });

    const upload = await pinata.upload.file(file).addMetadata({
      name: fileName,
      keyvalues: metadata,
    });

    const gatewayUrl = process.env.IPFS_GATEWAY || `https://${process.env.PINATA_GATEWAY}`;

    return {
      success: true,
      cid: upload.IpfsHash,
      ipfsUrl: `${gatewayUrl}/ipfs/${upload.IpfsHash}`,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`,
    };
  } catch (error) {
    console.error("Pinata upload error:", error);
    throw new Error(`Failed to upload to Pinata: ${error.message}`);
  }
};

/**
 * Upload JSON data to Pinata IPFS
 * @param {Object} jsonData - JSON data to upload
 * @param {string} name - Name for the JSON file
 * @returns {Promise<Object>} - Upload result with CID
 */
const uploadJSONToPinata = async (jsonData, name = "metadata.json") => {
  try {
    const upload = await pinata.upload.json(jsonData).addMetadata({
      name: name,
    });

    const gatewayUrl = process.env.IPFS_GATEWAY || `https://${process.env.PINATA_GATEWAY}`;

    return {
      success: true,
      cid: upload.IpfsHash,
      ipfsUrl: `${gatewayUrl}/ipfs/${upload.IpfsHash}`,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`,
    };
  } catch (error) {
    console.error("Pinata JSON upload error:", error);
    throw new Error(`Failed to upload JSON to Pinata: ${error.message}`);
  }
};

/**
 * Get file from Pinata IPFS
 * @param {string} cid - IPFS CID
 * @returns {Promise<Object>} - File data
 */
const getFromPinata = async (cid) => {
  try {
    const data = await pinata.gateways.get(cid);
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Pinata get error:", error);
    throw new Error(`Failed to get from Pinata: ${error.message}`);
  }
};

/**
 * Pin existing IPFS hash to Pinata
 * @param {string} cid - IPFS CID to pin
 * @param {string} name - Name for the pinned item
 * @returns {Promise<Object>} - Pin result
 */
const pinToPinata = async (cid, name = "") => {
  try {
    const result = await pinata.pin.cid(cid).addMetadata({
      name: name,
    });

    return {
      success: true,
      cid: result.IpfsHash,
    };
  } catch (error) {
    console.error("Pinata pin error:", error);
    throw new Error(`Failed to pin to Pinata: ${error.message}`);
  }
};

/**
 * Unpin file from Pinata
 * @param {string} cid - IPFS CID to unpin
 * @returns {Promise<Object>} - Unpin result
 */
const unpinFromPinata = async (cid) => {
  try {
    await pinata.unpin([cid]);
    return {
      success: true,
      message: "Unpinned successfully",
    };
  } catch (error) {
    console.error("Pinata unpin error:", error);
    throw new Error(`Failed to unpin from Pinata: ${error.message}`);
  }
};

/**
 * List all pinned files
 * @returns {Promise<Array>} - List of pinned files
 */
const listPinnedFiles = async () => {
  try {
    const files = await pinata.listFiles();
    return {
      success: true,
      files: files.rows,
    };
  } catch (error) {
    console.error("Pinata list error:", error);
    throw new Error(`Failed to list files from Pinata: ${error.message}`);
  }
};

module.exports = {
  pinata,
  uploadToPinata,
  uploadJSONToPinata,
  getFromPinata,
  pinToPinata,
  unpinFromPinata,
  listPinnedFiles,
};
