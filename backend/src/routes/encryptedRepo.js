const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const axios = require('axios');
const router = express.Router();

// Multer configuration for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// Simple auth middleware
const authMiddleware = (req, res, next) => {
  const wallet = req.headers['x-wallet'];
  if (!wallet) {
    return res.status(401).json({ 
      success: false, 
      error: 'Wallet address required in x-wallet header' 
    });
  }
  req.user = { walletAddress: wallet };
  next();
};

// Import utilities (will load TypeScript files via ts-node if available)
let encryptBuffer, pinEncryptedFile, wrapKey, unwrapKey, decryptBuffer, Repo;

try {
  // Try to load TypeScript modules
  require('ts-node/register');
  const cryptoUtils = require('../utils/crypto.ts');
  const ipfsUtils = require('../utils/ipfs.ts');
  const kmsUtils = require('../utils/kms.ts');
  Repo = require('../models/Repo.ts').default;
  
  encryptBuffer = cryptoUtils.encryptBuffer;
  decryptBuffer = cryptoUtils.decryptBuffer;
  pinEncryptedFile = ipfsUtils.pinEncryptedFile;
  wrapKey = kmsUtils.wrapKey;
  unwrapKey = kmsUtils.unwrapKey;
} catch (error) {
  console.warn('⚠️  TypeScript utilities not available. Encrypted upload disabled.');
}

/**
 * POST /api/uploads
 * Upload and encrypt repository
 */
router.post('/uploads', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    // Check if encryption utilities are available
    if (!encryptBuffer || !pinEncryptedFile || !wrapKey || !Repo) {
      return res.status(503).json({
        success: false,
        error: 'Encryption services not available. Please use /api/repo/create endpoint instead.'
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    const { title, description, thumbnailUrl, priceEth, licenseTemplates, tags, licenseType } = req.body;
    const ownerWallet = req.headers['x-wallet']?.toString().toLowerCase() || req.user?.walletAddress?.toLowerCase();
    
    if (!ownerWallet) {
      return res.status(401).json({ success: false, error: 'Wallet required' });
    }
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Step 1: Encrypt the file buffer
    console.log('🔐 Encrypting file...');
    const { key, iv, tag, encrypted } = encryptBuffer(file.buffer);
    
    // Step 2: Pin encrypted file to IPFS
    console.log('📤 Pinning to IPFS...');
    const cidEncrypted = await pinEncryptedFile(encrypted, `${title}.zip.enc`);
    
    // Step 3: Wrap the encryption key
    console.log('🔑 Wrapping encryption key...');
    const wrappedKey = await wrapKey(key);
    
    // Parse license templates if provided
    let parsedTemplates = [];
    if (licenseTemplates) {
      try {
        parsedTemplates = JSON.parse(licenseTemplates);
      } catch (e) {
        console.warn('Failed to parse licenseTemplates:', e);
      }
    }

    // Convert priceEth to Wei
    const ethers = require('ethers');
    const priceWei = priceEth ? ethers.parseEther(priceEth).toString() : '0';

    // Generate unique repo ID
    const repoId = `repo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Step 4: Save repo metadata to DB
    const repo = new Repo({
      repoId,
      title,
      description,
      thumbnailUrl,
      owner: ownerWallet,
      ownerWallet,
      priceWei,
      licenseType: licenseType || 'open',
      licenseTemplates: parsedTemplates,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      ipfsCid: cidEncrypted,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${cidEncrypted}`,
      fileName: file.originalname,
      fileSize: file.size,
      cidEncrypted,
      wrappedKey,
      encryptedKey: wrappedKey,
      wrapMethod: 'SERVER_KEK',
      keyMeta: {
        iv: iv.toString('base64'),
        tag: tag.toString('base64')
      },
      ipAssetRegistered: false,
      whitelist: [ownerWallet],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await repo.save();
    
    console.log(`✅ Repository created and encrypted: ${repoId}`);
    
    return res.status(201).json({
      success: true,
      repository: {
        repoId: repo.repoId,
        title: repo.title,
        description: repo.description,
        owner: repo.owner,
        licenseType: repo.licenseType,
        ipfsCid: repo.ipfsCid,
        ipfsUrl: repo.ipfsUrl,
        thumbnailUrl: repo.thumbnailUrl,
        tags: repo.tags,
        createdAt: repo.createdAt
      },
      message: 'Repository uploaded and encrypted successfully'
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Upload failed' 
    });
  }
});

/**
 * GET /api/repos/:id/metadata
 * Get public metadata (no auth required)
 */
router.get('/repos/:id/metadata', async (req, res) => {
  try {
    if (!Repo) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }
    
    const repo = await Repo.findById(req.params.id).select('-wrappedKey -encryptedKey -keyMeta -whitelist');
    if (!repo) {
      return res.status(404).json({ success: false, error: 'Repository not found' });
    }
    
    res.json({ success: true, repository: repo });
  } catch (error) {
    console.error('Metadata error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch metadata' });
  }
});

/**
 * GET /api/repos/:repoId/download
 * Download decrypted repository file
 */
router.get('/repos/:repoId/download', authMiddleware, async (req, res) => {
  try {
    if (!Repo) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    const { repoId } = req.params;
    const userWallet = req.user.walletAddress.toLowerCase();

    // Find repository
    const repo = await Repo.findOne({ repoId });
    if (!repo) {
      return res.status(404).json({ success: false, error: 'Repository not found' });
    }

    // Check access (owner or in whitelist)
    const hasAccess = repo.owner === userWallet || 
                      repo.ownerWallet === userWallet ||
                      (repo.whitelist && repo.whitelist.includes(userWallet));

    if (!hasAccess) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied. Purchase a license to download this repository.' 
      });
    }

    console.log(`🔓 Authorized download for ${userWallet}: ${repoId}`);

    // Check if decryption utilities are available
    if (!unwrapKey || !decryptBuffer) {
      return res.status(503).json({ 
        success: false, 
        error: 'Decryption service not available' 
      });
    }

    // Fetch encrypted file from IPFS
    console.log(`📥 Fetching from IPFS: ${repo.ipfsUrl}`);
    const ipfsResponse = await axios.get(repo.ipfsUrl, { 
      responseType: 'arraybuffer',
      timeout: 60000 // 60 second timeout
    });
    const encryptedBuffer = Buffer.from(ipfsResponse.data);
    console.log(`✅ Fetched ${encryptedBuffer.length} bytes from IPFS`);

    // Unwrap the encryption key
    console.log(`🔑 Unwrapping encryption key...`);
    const dataKey = await unwrapKey(repo.wrappedKey);
    console.log(`✅ Key unwrapped successfully`);

    // Decrypt the file
    console.log(`🔓 Decrypting file...`);
    const decrypted = decryptBuffer(
      encryptedBuffer,
      dataKey,
      Buffer.from(repo.keyMeta.iv, 'base64'),
      Buffer.from(repo.keyMeta.tag, 'base64')
    );

    console.log(`✅ File decrypted: ${repo.fileName} (${decrypted.length} bytes)`);

    // Send decrypted file
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${repo.fileName || repo.title + '.zip'}"`);
    res.setHeader('Content-Length', decrypted.length);
    res.send(decrypted);

  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to download repository' 
    });
  }
});

module.exports = router;
