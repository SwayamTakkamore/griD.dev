import express from 'express';
import { uploadRepository, uploadMiddleware } from '../controllers/uploadController';
import { getLicenseKey } from '../controllers/licenseController';
import { downloadRepo, getRepoFiles } from '../controllers/downloadController';
import checkRepoAccess from '../middleware/checkAccess';

const router = express.Router();

/**
 * Upload & Repository (with auth)
 */
// Add simple auth middleware that extracts wallet from header
const authMiddleware = (req: any, res: any, next: any) => {
  const wallet = req.headers['x-wallet'];
  if (!wallet) {
    return res.status(401).json({ success: false, error: 'Wallet address required in x-wallet header' });
  }
  req.user = { walletAddress: wallet };
  next();
};

router.post('/uploads', authMiddleware, uploadMiddleware, uploadRepository);

/**
 * License endpoints
 */
router.get('/licenses/:licenseId/key', getLicenseKey);

/**
 * Repo access (protected)
 */
router.get('/repos/:id/download', checkRepoAccess, downloadRepo);
router.get('/repos/:id/files', checkRepoAccess, getRepoFiles);

/**
 * Public metadata endpoint (no auth required)
 */
router.get('/repos/:id/metadata', async (req, res) => {
  const Repo = (await import('../models/Repo')).default;
  const repo = await Repo.findById(req.params.id).select('-wrappedKey -keyMeta -whitelist');
  if (!repo) return res.status(404).send('Not found');
  res.json(repo);
});

export default router;
