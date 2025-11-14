// Story Protocol Configuration
export const STORY_PROTOCOL_CONFIG = {
  CHAIN_ID: 1315, // Story Aeneid Testnet (official chain ID)
  CHAIN_NAME: 'Story Aeneid Testnet',
  RPC_URL: 'https://aeneid.storyrpc.io',
  EXPLORER_URL: 'https://aeneid.storyscan.io',
  CURRENCY: {
    name: 'IP',
    symbol: 'IP',
    decimals: 18,
  },
};

// License Types
export enum LicenseType {
  NON_COMMERCIAL = 'NON_COMMERCIAL',
  COMMERCIAL_USE = 'COMMERCIAL_USE',
  COMMERCIAL_REMIX = 'COMMERCIAL_REMIX',
}

// License Terms IDs (these are standard Story Protocol license terms)
export const LICENSE_TERMS = {
  NON_COMMERCIAL_SOCIAL_REMIXING: '1',
  COMMERCIAL_USE: '2',
  COMMERCIAL_REMIX: '3',
};

// Helper function to format IP Asset ID
export const formatIpId = (ipId: string): string => {
  if (!ipId) return '';
  return `${ipId.slice(0, 6)}...${ipId.slice(-4)}`;
};

// Helper function to get explorer link
export const getExplorerLink = (type: 'address' | 'tx' | 'ipAsset', value: string): string => {
  const baseUrl = STORY_PROTOCOL_CONFIG.EXPLORER_URL;
  switch (type) {
    case 'address':
      return `${baseUrl}/address/${value}`;
    case 'tx':
      return `${baseUrl}/tx/${value}`;
    case 'ipAsset':
      return `${baseUrl}/ip/${value}`;
    default:
      return baseUrl;
  }
};

// Helper to convert license type to human-readable text
export const getLicenseLabel = (licenseType: string): string => {
  switch (licenseType) {
    case LicenseType.NON_COMMERCIAL:
      return 'Non-Commercial Social Remixing';
    case LicenseType.COMMERCIAL_USE:
      return 'Commercial Use';
    case LicenseType.COMMERCIAL_REMIX:
      return 'Commercial Remix';
    default:
      return 'Unknown License';
  }
};

// Helper to get license description
export const getLicenseDescription = (licenseType: string): string => {
  switch (licenseType) {
    case LicenseType.NON_COMMERCIAL:
      return 'Allows others to remix and share your work for non-commercial purposes only';
    case LicenseType.COMMERCIAL_USE:
      return 'Allows others to use your work commercially, but not to create derivatives';
    case LicenseType.COMMERCIAL_REMIX:
      return 'Allows others to use and remix your work for commercial purposes';
    default:
      return '';
  }
};

// Network configuration for MetaMask
export const getNetworkConfig = () => ({
  chainId: `0x${STORY_PROTOCOL_CONFIG.CHAIN_ID.toString(16)}`, // Convert chain ID to hex
  chainName: STORY_PROTOCOL_CONFIG.CHAIN_NAME,
  nativeCurrency: STORY_PROTOCOL_CONFIG.CURRENCY,
  rpcUrls: [STORY_PROTOCOL_CONFIG.RPC_URL],
  blockExplorerUrls: [STORY_PROTOCOL_CONFIG.EXPLORER_URL],
});

// Check if current network is Story Protocol
export const isStoryNetwork = (chainId: number): boolean => {
  return chainId === STORY_PROTOCOL_CONFIG.CHAIN_ID; // Story Odyssey testnet chain ID
};
