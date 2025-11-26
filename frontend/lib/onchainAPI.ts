// API Client for Onchain Storage
// Frontend helper for blockchain queries

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export const onchainAPI = {
  /**
   * Create repository (uploads to IPFS + registers on blockchain)
   */
  async createRepository(formData: FormData, token: string) {
    const response = await fetch(`${API_URL}/api/repo/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create repository');
    }

    return response.json();
  },

  /**
   * Get repository from blockchain
   */
  async getRepository(ipAssetId: string) {
    const response = await fetch(`${API_URL}/api/repo/${ipAssetId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch repository');
    }

    return response.json();
  },

  /**
   * Get user repositories from blockchain
   */
  async getUserRepositories(walletAddress: string) {
    const response = await fetch(`${API_URL}/api/repo/user/${walletAddress}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch repositories');
    }

    return response.json();
  },

  /**
   * Get user profile from blockchain
   */
  async getUserProfile(walletAddress: string) {
    const response = await fetch(`${API_URL}/api/user/${walletAddress}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch profile');
    }

    return response.json();
  },

  /**
   * Update user bio (stores on IPFS)
   */
  async updateUserBio(walletAddress: string, bio: string, token: string) {
    const response = await fetch(`${API_URL}/api/user/${walletAddress}/bio`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bio }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update bio');
    }

    return response.json();
  },

  /**
   * Download repository file from IPFS
   */
  async downloadRepository(ipAssetId: string, walletAddress: string) {
    const response = await fetch(`${API_URL}/api/repos/${ipAssetId}/download`, {
      headers: {
        'x-wallet': walletAddress,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to download');
    }

    return response.blob();
  },

  /**
   * Get IPFS content
   */
  getIPFSUrl(cid: string) {
    return `https://ipfs.io/ipfs/${cid}`;
  },

  /**
   * Get blockchain explorer URL
   */
  getExplorerUrl(txHash: string) {
    return `https://aeneid.storyscan.io/tx/${txHash}`;
  },

  /**
   * Get IP Asset explorer URL
   */
  getIPAssetUrl(ipAssetId: string) {
    return `https://aeneid.storyscan.io/ip/${ipAssetId}`;
  },
};

// React Hook for onchain storage
import { useState } from 'react';
import { useAuthStore } from '@/store/auth';

export function useOnchainStorage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuthStore();

  const createRepository = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await onchainAPI.createRepository(formData, token || '');
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRepository = async (ipAssetId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await onchainAPI.getRepository(ipAssetId);
      return result.repository;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserRepositories = async (walletAddress: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await onchainAPI.getUserRepositories(walletAddress);
      return result.repositories;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async (walletAddress: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await onchainAPI.getUserProfile(walletAddress);
      return result.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBio = async (bio: string) => {
    if (!user) throw new Error('User not logged in');
    
    setLoading(true);
    setError(null);
    try {
      const result = await onchainAPI.updateUserBio(
        user.walletAddress,
        bio,
        token || ''
      );
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadRepository = async (ipAssetId: string) => {
    if (!user) throw new Error('User not logged in');
    
    setLoading(true);
    setError(null);
    try {
      const blob = await onchainAPI.downloadRepository(
        ipAssetId,
        user.walletAddress
      );
      return blob;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createRepository,
    getRepository,
    getUserRepositories,
    getUserProfile,
    updateBio,
    downloadRepository,
  };
}
