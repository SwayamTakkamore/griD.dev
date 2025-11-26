import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(process.env.STORY_RPC_URL || 'https://aeneid.storyrpc.io');

/**
 * ABI fragments for LicenseNFT ownerOf
 */
const licenseNftAbi = [
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)'
];

/**
 * Check if a wallet owns a specific license NFT token
 */
export async function verifyOnChainOwnership(licenseTokenId: string, wallet: string): Promise<boolean> {
  try {
    const contractAddress = process.env.LICENSE_NFT_ADDRESS;
    if (!contractAddress) {
      console.error('LICENSE_NFT_ADDRESS not set');
      return false;
    }
    
    const contract = new ethers.Contract(contractAddress, licenseNftAbi, provider);
    const owner = await contract.ownerOf(licenseTokenId);
    
    return owner.toLowerCase() === wallet.toLowerCase();
  } catch (error) {
    console.error('On-chain verification error:', error);
    return false;
  }
}

/**
 * Check if a wallet owns the repository NFT
 */
export async function checkTokenOwnershipOnChain(repoTokenId: string, wallet: string): Promise<boolean> {
  try {
    const contractAddress = process.env.REPO_NFT_ADDRESS;
    if (!contractAddress) {
      console.error('REPO_NFT_ADDRESS not set');
      return false;
    }
    
    const contract = new ethers.Contract(contractAddress, licenseNftAbi, provider);
    const owner = await contract.ownerOf(repoTokenId);
    
    return owner.toLowerCase() === wallet.toLowerCase();
  } catch (error) {
    console.error('Repo ownership check error:', error);
    return false;
  }
}

/**
 * Get license details from contract (if needed)
 */
export async function getLicenseDetailsOnChain(licenseTokenId: string) {
  try {
    const contractAddress = process.env.LICENSE_NFT_ADDRESS;
    if (!contractAddress) throw new Error('LICENSE_NFT_ADDRESS not set');
    
    const abi = [
      'function licenseToRepo(uint256) view returns (uint256)',
      'function licenseTemplate(uint256) view returns (uint256)',
      'function ownerOf(uint256) view returns (address)'
    ];
    
    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    const [repoId, templateId, owner] = await Promise.all([
      contract.licenseToRepo(licenseTokenId),
      contract.licenseTemplate(licenseTokenId),
      contract.ownerOf(licenseTokenId)
    ]);
    
    return { repoId: repoId.toString(), templateId: templateId.toString(), owner };
  } catch (error) {
    console.error('Get license details error:', error);
    return null;
  }
}
