import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { Repository } from '@/types';
import toast from 'react-hot-toast';
import { useRepositoryContract } from './useRepositoryContract';

export const useRepository = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createRepositoryOnChain } = useRepositoryContract();

  // Create repository
  const createRepository = useCallback(async (data: {
    title: string;
    description: string;
    licenseType: string;
    tags: string;
    file: File;
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Upload to IPFS and create in MongoDB (via backend)
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('licenseType', data.licenseType);
      formData.append('tags', data.tags);
      formData.append('file', data.file);

      const response: any = await apiClient.createRepository(formData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create repository');
      }

      const repository = response.repository;

      // Step 2: Register on blockchain (user signs with MetaMask)
      try {
        toast.loading('Creating repository on blockchain...', { id: 'blockchain' });
        
        await createRepositoryOnChain(
          repository.repoId,
          repository.ipfsCid,
          repository.ipAssetId || ''
        );
        
        toast.success('Repository created on blockchain!', { id: 'blockchain' });
      } catch (blockchainError: any) {
        // Don't fail if blockchain registration fails - data is already in MongoDB
        console.warn('Blockchain registration failed:', blockchainError);
        toast.error('Repository created in database, but blockchain registration failed. You can try again later.', { id: 'blockchain' });
      }

      toast.success('Repository created successfully!');
      return repository;

    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create repository';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createRepositoryOnChain]);

  // Get repository
  const getRepository = useCallback(async (repoId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: any = await apiClient.getRepository(repoId);

      if (response.success) {
        return response.repository as Repository;
      }

      throw new Error(response.error || 'Repository not found');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch repository';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user repositories
  const getUserRepositories = useCallback(async (walletAddress: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: any = await apiClient.getUserRepositories(walletAddress);

      if (response.success) {
        return response.repositories as Repository[];
      }

      throw new Error(response.error || 'Failed to fetch repositories');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch repositories';
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all repositories
  const getAllRepositories = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    license?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response: any = await apiClient.getAllRepositories(params);

      if (response.success) {
        return {
          repositories: response.repositories as Repository[],
          count: response.count,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
        };
      }

      throw new Error(response.error || 'Failed to fetch repositories');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch repositories';
      setError(errorMsg);
      return { repositories: [], count: 0, totalPages: 0, currentPage: 1 };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create commit
  const createCommit = useCallback(async (data: {
    repoId: string;
    message: string;
    description?: string;
    file: File;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('repoId', data.repoId);
      formData.append('message', data.message);
      if (data.description) {
        formData.append('description', data.description);
      }
      formData.append('file', data.file);

      const response: any = await apiClient.createCommit(formData);

      if (response.success) {
        toast.success('Commit created successfully!');
        return response.commit;
      }

      throw new Error(response.error || 'Failed to create commit');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create commit';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createRepository,
    getRepository,
    getUserRepositories,
    getAllRepositories,
    createCommit,
  };
};
