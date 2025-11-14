// User types
export interface User {
  walletAddress: string;
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  totalContributions: number;
  repositories?: Repository[];
  createdAt: string;
}

// Repository types
export interface Repository {
  _id: string;
  repoId: string;
  title: string;
  description: string;
  owner: string;
  ownerRef?: User;
  licenseType: 'open' | 'restricted' | 'paid';
  ipfsCid: string;
  ipfsUrl: string;
  ipAssetId?: string;
  ipAssetTxHash?: string;
  ipAssetRegistered: boolean;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  stars: number;
  forks: number;
  commits: Commit[];
  contributors: Contributor[];
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Commit types
export interface Commit {
  _id: string;
  commitId: string;
  repositoryId: string;
  repoId: string;
  author: string;
  authorRef?: User;
  message: string;
  description?: string;
  ipfsCid: string;
  ipfsUrl: string;
  fileName?: string;
  fileSize?: number;
  filesChanged: number;
  additions: number;
  deletions: number;
  commitNumber: number;
  verified: boolean;
  txHash?: string;
  createdAt: string;
}

// Contributor types
export interface Contributor {
  walletAddress: string;
  contributions: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}

// Form types
export interface CreateRepoForm {
  title: string;
  description: string;
  licenseType: 'open' | 'restricted' | 'paid';
  tags: string;
  file: File | null;
}

export interface CreateCommitForm {
  repoId: string;
  message: string;
  description?: string;
  file: File | null;
}

export interface UpdateProfileForm {
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Wallet types
export interface WalletState {
  address: string | null;
  provider: any;
  signer: any;
  chainId: number | null;
  isConnecting: boolean;
  isConnected: boolean;
}
