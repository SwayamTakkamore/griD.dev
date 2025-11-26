import { Request, Response } from 'express';
import License from '../models/License';
import Repo from '../models/Repo';
import { unwrapKey } from '../utils/kms';
import { verifyOnChainOwnership } from '../utils/onchain';

// Skeleton: GET /api/licenses/:licenseId/key
export async function getLicenseKey(req: Request, res: Response) {
  try {
    const { licenseId } = req.params;
    const wallet = (req.headers['x-wallet'] || req.body.wallet || '').toString();
    if (!wallet) return res.status(400).send('Missing wallet header');

    const license = await License.findById(licenseId);
    if (!license) return res.status(404).send('License not found');

    // DB check
    if (license.buyerWallet.toLowerCase() !== wallet.toLowerCase()) {
      // fallback: check on-chain (in case DB not updated yet)
      const onChain = await verifyOnChainOwnership(license.licenseTokenId, wallet);
      if (!onChain) return res.status(403).send('Not owner');
    }

    // Unwrap CEK (implementation depends on KMS or server KEK)
    const wrappedKey = license.wrappedKey;
    const cek: Buffer = await unwrapKey(wrappedKey);

    // Return CEK base64 (consumer should use it to decrypt or server will stream decrypted payload)
    return res.json({ keyBase64: cek.toString('base64') });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
}
