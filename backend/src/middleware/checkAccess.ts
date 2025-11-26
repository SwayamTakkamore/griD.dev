import { Request, Response, NextFunction } from 'express';
import Repo from '../models/Repo';
import License from '../models/License';
import { checkTokenOwnershipOnChain } from '../utils/onchain';

export default async function checkRepoAccess(req: Request, res: Response, next: NextFunction) {
  try {
    const wallet = (req.headers['x-wallet'] || '').toString().toLowerCase();
    const repoId = req.params.id;
    if (!wallet) return res.status(401).send('Missing wallet');

    const repo = await Repo.findById(repoId);
    if (!repo) return res.status(404).send('Repo not found');

    // Owner
    if (repo.ownerWallet.toLowerCase() === wallet) return next();

    // Whitelist
    if (Array.isArray(repo.whitelist) && repo.whitelist.map((w: string) => w.toLowerCase()).includes(wallet)) return next();

    // DB license record
    const license = await License.findOne({ repoId, buyerWallet: wallet, revoked: false });
    if (license && (!license.expiresAt || license.expiresAt > new Date())) return next();

    // On-chain fallback
    const ownerOnChain = await checkTokenOwnershipOnChain(repo.repoTokenId, wallet);
    if (ownerOnChain) return next();

    return res.status(403).send({ error: 'Access denied' });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
}
