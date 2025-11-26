import { PinataSDK } from 'pinata-web3';
import { Readable } from 'stream';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || '',
  pinataGateway: process.env.PINATA_GATEWAY || 'gateway.pinata.cloud'
});

/**
 * Pin encrypted buffer to IPFS via Pinata
 */
export async function pinEncryptedFile(encryptedBuffer: Buffer, filename: string): Promise<string> {
  try {
    // Convert buffer to Blob (for Pinata SDK)
    const blob = new Blob([encryptedBuffer], { type: 'application/octet-stream' });
    const file = new File([blob], filename, { type: 'application/octet-stream' });
    
    const upload = await pinata.upload.file(file);
    
    console.log('Pinned to IPFS:', upload.IpfsHash);
    return upload.IpfsHash;
  } catch (error) {
    console.error('IPFS pinning error:', error);
    throw new Error('Failed to pin to IPFS');
  }
}

/**
 * Get IPFS gateway URL for a CID
 */
export function getIpfsUrl(cid: string): string {
  const gateway = process.env.PINATA_GATEWAY || 'gateway.pinata.cloud';
  return `https://${gateway}/ipfs/${cid}`;
}

/**
 * Fetch encrypted content from IPFS
 */
export async function fetchEncryptedFromIpfs(cid: string): Promise<Buffer> {
  const url = getIpfsUrl(cid);
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
