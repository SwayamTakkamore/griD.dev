import { useState, useEffect, useCallback } from 'react';
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { useWalletStore } from '@/store/walletStore';
import { STORY_PROTOCOL_CONFIG } from '@/lib/storyProtocol';
import { http } from 'viem';
import toast from 'react-hot-toast';

export const useStoryProtocol = () => {
  const { address, signer } = useWalletStore();
  const [client, setClient] = useState<any | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Story Protocol Client
  const initializeClient = useCallback(async () => {
    if (!signer || !address) {
      setError('Wallet not connected');
      return null;
    }

    setIsInitializing(true);
    setError(null);

    try {
      // Configure Story Protocol SDK for Aeneid Testnet
      const config: StoryConfig = {
        account: signer as any,
        transport: http(STORY_PROTOCOL_CONFIG.RPC_URL),
        chainId: 'aeneid', // Story Aeneid Testnet
      };

      const storyClient = StoryClient.newClient(config);
      setClient(storyClient);
      return storyClient;
    } catch (err: any) {
      console.error('Failed to initialize Story Protocol client:', err);
      const errorMsg = err.message || 'Failed to initialize Story Protocol';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, [signer, address]);

  // Register an IP Asset
  const registerIpAsset = useCallback(
    async (metadata: {
      name: string;
      description: string;
      ipfsHash: string;
      attributes?: Record<string, any>;
    }) => {
      try {
        if (!client) {
          const newClient = await initializeClient();
          if (!newClient) {
            throw new Error('Failed to initialize Story Protocol client');
          }
        }

        toast.loading('Registering IP Asset on Story Protocol...', { id: 'register-ip' });

        // Register IP Asset
        const response = await client!.ipAsset.register({
          nftContract: address!, // Using wallet address as NFT contract for simplicity
          tokenId: BigInt(Date.now()), // Use timestamp as tokenId
          ipMetadata: {
            ipMetadataURI: `ipfs://${metadata.ipfsHash}`,
            ipMetadataHash: metadata.ipfsHash,
            nftMetadataURI: `ipfs://${metadata.ipfsHash}`,
            nftMetadataHash: metadata.ipfsHash,
          },
        });

        toast.success('IP Asset registered successfully!', { id: 'register-ip' });
        return response;
      } catch (err: any) {
        console.error('Failed to register IP Asset:', err);
        const errorMsg = err.message || 'Failed to register IP Asset';
        toast.error(errorMsg, { id: 'register-ip' });
        throw err;
      }
    },
    [client, initializeClient, address]
  );

  // Get IP Asset details
  const getIpAsset = useCallback(
    async (ipId: string) => {
      try {
        if (!client) {
          const newClient = await initializeClient();
          if (!newClient) {
            throw new Error('Failed to initialize Story Protocol client');
          }
        }

        const ipAsset = await client!.ipAsset.get(ipId);
        return ipAsset;
      } catch (err: any) {
        console.error('Failed to get IP Asset:', err);
        throw err;
      }
    },
    [client, initializeClient]
  );

  // Attach license terms to IP Asset
  const attachLicenseTerms = useCallback(
    async (ipId: string, licenseTermsId: string) => {
      try {
        if (!client) {
          const newClient = await initializeClient();
          if (!newClient) {
            throw new Error('Failed to initialize Story Protocol client');
          }
        }

        toast.loading('Attaching license terms...', { id: 'attach-license' });

        const response = await client!.license.attachLicenseTerms({
          ipId,
          licenseTermsId,
        });

        toast.success('License terms attached!', { id: 'attach-license' });
        return response;
      } catch (err: any) {
        console.error('Failed to attach license terms:', err);
        const errorMsg = err.message || 'Failed to attach license terms';
        toast.error(errorMsg, { id: 'attach-license' });
        throw err;
      }
    },
    [client, initializeClient]
  );

  // Create a license
  const mintLicense = useCallback(
    async (ipId: string, amount: number) => {
      try {
        if (!client) {
          const newClient = await initializeClient();
          if (!newClient) {
            throw new Error('Failed to initialize Story Protocol client');
          }
        }

        toast.loading('Minting license...', { id: 'mint-license' });

        const response = await client!.license.mintLicenseTokens({
          licensorIpId: ipId,
          licenseTermsId: '1', // Default license terms
          amount: BigInt(amount),
          receiver: address!,
        });

        toast.success('License minted successfully!', { id: 'mint-license' });
        return response;
      } catch (err: any) {
        console.error('Failed to mint license:', err);
        const errorMsg = err.message || 'Failed to mint license';
        toast.error(errorMsg, { id: 'mint-license' });
        throw err;
      }
    },
    [client, initializeClient, address]
  );

  // Initialize client when wallet is connected
  useEffect(() => {
    if (signer && address && !client) {
      initializeClient();
    }
  }, [signer, address, client, initializeClient]);

  return {
    client,
    isInitializing,
    error,
    initializeClient,
    registerIpAsset,
    getIpAsset,
    attachLicenseTerms,
    mintLicense,
  };
};
