import { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import { useWalletStore } from '@/store/walletStore';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { getNetworkConfig, isStoryNetwork } from '@/lib/storyProtocol';
import toast from 'react-hot-toast';

export const useWallet = () => {
  const { address, isConnecting, isConnected, setWallet, setConnecting, disconnect: disconnectStore } = useWalletStore();
  const { login, logout } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }, []);

  // Switch to Story Aeneid Testnet
  const switchToStoryNetwork = useCallback(async () => {
    try {
      const networkConfig = getNetworkConfig();
      
      try {
        // Try to switch to the network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: networkConfig.chainId }],
        });
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkConfig],
          });
        } else {
          throw switchError;
        }
      }
      
      toast.success('Switched to Story Aeneid Testnet');
      return true;
    } catch (err: any) {
      console.error('Failed to switch network:', err);
      toast.error('Failed to switch to Story Aeneid Testnet');
      return false;
    }
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('Please install MetaMask to continue');
      toast.error('Please install MetaMask');
      return;
    }

    setConnecting(true);
    setError(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      
      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      const walletAddress = accounts[0];

      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Check if we're on Story Network, if not switch
      if (!isStoryNetwork(chainId)) {
        toast.loading('Switching to Story Aeneid Testnet...', { id: 'network-switch' });
        const switched = await switchToStoryNetwork();
        toast.dismiss('network-switch');
        
        if (!switched) {
          throw new Error('Please switch to Story Aeneid Testnet to continue');
        }
        
        // Get updated network info after switch
        const updatedNetwork = await provider.getNetwork();
        const updatedChainId = Number(updatedNetwork.chainId);
        
        // Update wallet store with correct chain
        setWallet({
          address: walletAddress,
          provider,
          signer: await provider.getSigner(),
          chainId: updatedChainId,
        });
      } else {
        // Update wallet store
        setWallet({
          address: walletAddress,
          provider,
          signer,
          chainId,
        });
      }

      toast.success('Wallet connected!');
      return walletAddress;
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
      toast.error('Failed to connect wallet');
      setConnecting(false);
      return null;
    } finally {
      setConnecting(false);
    }
  }, [isMetaMaskInstalled, setWallet, setConnecting, switchToStoryNetwork]);

  // Authenticate with backend
  const authenticate = useCallback(async (walletAddress: string) => {
    try {
      console.log('Starting authentication for:', walletAddress);
      
      // Get nonce from backend
      const nonceResponse: any = await apiClient.getNonce(walletAddress);
      console.log('Nonce response:', nonceResponse);
      
      if (!nonceResponse.success || !nonceResponse.nonce) {
        throw new Error('Failed to get nonce from server');
      }
      
      const nonce = nonceResponse.nonce;

      // Create message to sign
      const message = `Sign this message to authenticate with griD.dev\n\nNonce: ${nonce}`;
      console.log('Message to sign:', message);

      // Get signer
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Sign message
      toast.loading('Please sign the message in MetaMask...');
      const signature = await signer.signMessage(message);
      console.log('Signature obtained:', signature);
      toast.dismiss();

      // Login with signature
      console.log('Sending login request...');
      const loginResponse: any = await apiClient.login(walletAddress, signature);
      console.log('Login response:', loginResponse);

      if (loginResponse.success) {
        login(loginResponse.user, loginResponse.token);
        toast.success('Successfully authenticated!');
        return true;
      }

      toast.error('Authentication failed: Invalid response from server');
      return false;
    } catch (err: any) {
      console.error('Authentication error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Authentication failed';
      toast.error(`Authentication failed: ${errorMessage}`);
      return false;
    }
  }, [login]);

  // Connect and authenticate
  const connectAndAuth = useCallback(async () => {
    const walletAddress = await connect();
    if (walletAddress) {
      await authenticate(walletAddress);
    }
  }, [connect, authenticate]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    disconnectStore();
    logout();
    toast.success('Wallet disconnected');
  }, [disconnectStore, logout]);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          connectAndAuth();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [disconnect, connectAndAuth]);

  return {
    address,
    isConnected,
    isConnecting,
    error,
    connect,
    authenticate,
    connectAndAuth,
    disconnect,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
};
