import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWalletStore } from '@/store/walletStore';
import toast from 'react-hot-toast';
import RepositoryRegistryABI from '@/contracts/RepositoryRegistry.json';

// Will be populated after deployment
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REPOSITORY_CONTRACT || '';

export const useRepositoryContract = () => {
  const { provider, signer, address } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Get contract instance
   */
  const getContract = useCallback(() => {
    if (!CONTRACT_ADDRESS) {
      console.error('Contract address not found. NEXT_PUBLIC_REPOSITORY_CONTRACT:', process.env.NEXT_PUBLIC_REPOSITORY_CONTRACT);
      throw new Error('Contract not deployed yet. Please restart the frontend server.');
    }
    if (!signer) {
      // Read-only contract
      const rpcProvider = new ethers.JsonRpcProvider('https://aeneid.storyrpc.io');
      return new ethers.Contract(CONTRACT_ADDRESS, RepositoryRegistryABI.abi, rpcProvider);
    }
    return new ethers.Contract(CONTRACT_ADDRESS, RepositoryRegistryABI.abi, signer);
  }, [signer]);

  /**
   * Create repository on-chain
   */
  const createRepositoryOnChain = useCallback(
    async (repoId: string, ipfsCid: string, storyIpId: string = '') => {
      if (!signer || !address) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      try {
        const contract = getContract();

        toast.loading('Creating repository on-chain...', { id: 'create-repo' });

        // Call contract method
        const tx = await contract.createRepository(repoId, ipfsCid, storyIpId);
        
        toast.loading('Waiting for confirmation...', { id: 'create-repo' });
        const receipt = await tx.wait();

        toast.success('Repository created on-chain!', { id: 'create-repo' });

        // Parse event data
        const event = receipt.logs
          .map((log: any) => {
            try {
              return contract.interface.parseLog(log);
            } catch {
              return null;
            }
          })
          .find((e: any) => e?.name === 'RepositoryCreated');

        return {
          success: true,
          txHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          event: event ? {
            repoId: event.args.repoId,
            ipfsCid: event.args.ipfsCid,
            owner: event.args.owner,
            storyIpId: event.args.storyIpId,
            timestamp: event.args.timestamp,
          } : null,
        };
      } catch (error: any) {
        console.error('Create repository on-chain error:', error);
        toast.error(error.reason || error.message || 'Failed to create repository', {
          id: 'create-repo',
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [signer, address, getContract]
  );

  /**
   * Update repository (new commit)
   */
  const updateRepositoryOnChain = useCallback(
    async (repoId: string, newIpfsCid: string, newStoryIpId: string = '') => {
      if (!signer) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      try {
        const contract = getContract();

        toast.loading('Updating repository on-chain...', { id: 'update-repo' });

        const tx = await contract.updateRepository(repoId, newIpfsCid, newStoryIpId);
        await tx.wait();

        toast.success('Repository updated on-chain!', { id: 'update-repo' });

        return { success: true, txHash: tx.hash };
      } catch (error: any) {
        console.error('Update repository error:', error);
        toast.error(error.reason || error.message || 'Failed to update repository', {
          id: 'update-repo',
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [signer, getContract]
  );

  /**
   * Get repository from blockchain
   */
  const getRepositoryFromChain = useCallback(
    async (repoId: string) => {
      try {
        const contract = getContract();
        const repo = await contract.getRepository(repoId);

        return {
          repoId: repo[0],
          ipfsCid: repo[1],
          owner: repo[2],
          storyIpId: repo[3],
          createdAt: Number(repo[4]),
        };
      } catch (error: any) {
        console.error('Get repository error:', error);
        throw error;
      }
    },
    [getContract]
  );

  /**
   * Check if repository exists on-chain
   */
  const repositoryExists = useCallback(
    async (repoId: string) => {
      try {
        const contract = getContract();
        return await contract.repositoryExists(repoId);
      } catch (error) {
        return false;
      }
    },
    [getContract]
  );

  /**
   * Get repositories owned by address
   */
  const getRepositoriesByOwner = useCallback(
    async (ownerAddress: string) => {
      try {
        const contract = getContract();
        return await contract.getRepositoriesByOwner(ownerAddress);
      } catch (error: any) {
        console.error('Get repositories by owner error:', error);
        throw error;
      }
    },
    [getContract]
  );

  /**
   * Transfer ownership
   */
  const transferOwnership = useCallback(
    async (repoId: string, newOwner: string) => {
      if (!signer) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      try {
        const contract = getContract();

        toast.loading('Transferring ownership...', { id: 'transfer' });

        const tx = await contract.transferOwnership(repoId, newOwner);
        await tx.wait();

        toast.success('Ownership transferred!', { id: 'transfer' });

        return { success: true, txHash: tx.hash };
      } catch (error: any) {
        console.error('Transfer ownership error:', error);
        toast.error(error.reason || error.message || 'Failed to transfer ownership', {
          id: 'transfer',
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [signer, getContract]
  );

  return {
    contractAddress: CONTRACT_ADDRESS,
    isLoading,
    createRepositoryOnChain,
    updateRepositoryOnChain,
    getRepositoryFromChain,
    repositoryExists,
    getRepositoriesByOwner,
    transferOwnership,
  };
};
