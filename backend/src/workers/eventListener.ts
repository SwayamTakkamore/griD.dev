import { ethers } from 'ethers';
import License from '../models/License';
import Repo from '../models/Repo';

const provider = new ethers.JsonRpcProvider(process.env.STORY_RPC_URL || 'https://aeneid.storyrpc.io');

/**
 * Event listener for LicenseNFT contract
 * Listens for LicenseMinted events and updates database
 */
export async function startLicenseEventListener() {
  const contractAddress = process.env.LICENSE_NFT_ADDRESS;
  if (!contractAddress) {
    console.error('LICENSE_NFT_ADDRESS not set');
    return;
  }
  
  const abi = [
    'event LicenseMinted(uint256 licenseId, uint256 repoId, address buyer, uint256 templateId)'
  ];
  
  const contract = new ethers.Contract(contractAddress, abi, provider);
  
  console.log('👂 Listening for LicenseMinted events...');
  
  contract.on('LicenseMinted', async (licenseId, repoId, buyer, templateId, event) => {
    console.log(`📬 LicenseMinted: licenseId=${licenseId}, repoId=${repoId}, buyer=${buyer}`);
    
    try {
      // Find repo in DB to get wrappedKey
      const repo = await Repo.findOne({ repoTokenId: repoId.toString() });
      if (!repo) {
        console.error(`Repo not found for repoTokenId: ${repoId}`);
        return;
      }
      
      // Create license record
      const license = new License({
        repoId: repo._id,
        licenseTokenId: licenseId.toString(),
        buyerWallet: buyer.toLowerCase(),
        templateId: templateId.toString(),
        purchaseTxHash: event.log.transactionHash,
        issuedAt: new Date(),
        revoked: false,
        wrappedKey: repo.wrappedKey // Copy the repo's CEK
      });
      
      await license.save();
      console.log(`✅ License record created: ${license._id}`);
    } catch (error) {
      console.error('Error processing LicenseMinted event:', error);
    }
  });
}

/**
 * Event listener for RepoNFT contract
 * Listens for RepositoryRegistered events
 */
export async function startRepoEventListener() {
  const contractAddress = process.env.REPO_NFT_ADDRESS;
  if (!contractAddress) {
    console.error('REPO_NFT_ADDRESS not set');
    return;
  }
  
  const abi = [
    'event RepositoryRegistered(uint256 indexed repoId, address indexed owner, string metadataUri)'
  ];
  
  const contract = new ethers.Contract(contractAddress, abi, provider);
  
  console.log('👂 Listening for RepositoryRegistered events...');
  
  contract.on('RepositoryRegistered', async (repoId, owner, metadataUri, event) => {
    console.log(`📬 RepositoryRegistered: repoId=${repoId}, owner=${owner}`);
    
    try {
      // Update repo in DB
      const repo = await Repo.findOne({ ownerWallet: owner.toLowerCase(), ipAssetRegistered: false });
      if (repo) {
        repo.ipAssetRegistered = true;
        repo.repoTokenId = repoId.toString();
        repo.ipAssetTxHash = event.log.transactionHash;
        await repo.save();
        console.log(`✅ Repo updated: ${repo._id}`);
      }
    } catch (error) {
      console.error('Error processing RepositoryRegistered event:', error);
    }
  });
}

/**
 * Start all event listeners
 */
export function startEventListeners() {
  startLicenseEventListener();
  startRepoEventListener();
}
