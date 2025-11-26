import { Request, Response } from 'express';
import Repo from '../models/Repo';
import { unwrapKey } from '../utils/kms';
import { fetchEncryptedFromIpfs } from '../utils/ipfs';
import { decryptBuffer } from '../utils/crypto';

/**
 * GET /api/repos/:id/download
 * Stream decrypted ZIP to authorized users
 * Requires checkAccess middleware
 */
export async function downloadRepo(req: Request, res: Response) {
  try {
    const repoId = req.params.id;
    
    const repo = await Repo.findById(repoId);
    if (!repo) return res.status(404).send('Repo not found');
    
    // Fetch encrypted file from IPFS
    console.log('Fetching encrypted file from IPFS...');
    const encryptedBuffer = await fetchEncryptedFromIpfs(repo.cidEncrypted);
    
    // Unwrap CEK
    console.log('Unwrapping encryption key...');
    const cek = await unwrapKey(repo.wrappedKey);
    
    // Decrypt
    console.log('Decrypting file...');
    const iv = Buffer.from(repo.keyMeta.iv, 'base64');
    const tag = Buffer.from(repo.keyMeta.tag, 'base64');
    const decrypted = decryptBuffer(encryptedBuffer, cek, iv, tag);
    
    // Stream to client
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${repo.title}.zip"`);
    res.setHeader('Content-Length', decrypted.length.toString());
    
    res.send(decrypted);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).send('Download failed');
  }
}

/**
 * GET /api/repos/:id/files
 * Return file tree (authorized only)
 * Requires checkAccess middleware
 */
export async function getRepoFiles(req: Request, res: Response) {
  try {
    const repoId = req.params.id;
    
    const repo = await Repo.findById(repoId);
    if (!repo) return res.status(404).send('Repo not found');
    
    // TODO: Extract file tree from encrypted ZIP or cache it during upload
    // For now, return placeholder
    return res.json({
      files: [
        { name: 'src', type: 'folder', children: [] },
        { name: 'README.md', type: 'file', size: 1024 },
        { name: 'package.json', type: 'file', size: 512 }
      ]
    });
  } catch (error) {
    console.error('Get files error:', error);
    return res.status(500).send('Failed to get files');
  }
}
