import { Request, Response } from 'express';
import multer from 'multer';
import { encryptBuffer } from '../utils/crypto';
import { pinEncryptedFile } from '../utils/ipfs';
import { wrapKey } from '../utils/kms';
import Repo from '../models/Repo';

const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 100 * 1024 * 1024 }
}); // 100MB

/**
 * POST /api/uploads
 * Upload and encrypt repository ZIP, pin to IPFS
 */
export async function uploadRepository(req: Request, res: Response) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, error: 'No file uploaded' });
    
    const { title, description, thumbnailUrl, priceEth, licenseTemplates, tags, licenseType } = req.body;
    const ownerWallet = req.headers['x-wallet']?.toString().toLowerCase() || (req as any).user?.walletAddress?.toLowerCase();
    
    if (!ownerWallet) return res.status(401).json({ success: false, error: 'Wallet required' });
    if (!title || !description) return res.status(400).json({ success: false, error: 'Missing required fields' });
    
    // Step 1: Encrypt the file buffer
    console.log('Encrypting file...');
    const { key, iv, tag, encrypted } = encryptBuffer(file.buffer);
    
    // Step 2: Pin encrypted file to IPFS
    console.log('Pinning to IPFS...');
    const cidEncrypted = await pinEncryptedFile(encrypted, `${title}.zip.enc`);
    
    // Step 3: Wrap the encryption key
    console.log('Wrapping encryption key...');
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
      tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
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
    console.error('Upload error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    });
  }
}

export const uploadMiddleware = upload.single('file');
