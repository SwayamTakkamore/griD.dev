import { create } from 'zustand';
import { WalletState } from '@/types';

interface WalletStore extends WalletState {
  setWallet: (wallet: Partial<WalletState>) => void;
  setConnecting: (connecting: boolean) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  address: null,
  provider: null,
  signer: null,
  chainId: null,
  isConnecting: false,
  isConnected: false,

  setWallet: (wallet) =>
    set((state) => ({
      ...state,
      ...wallet,
      isConnected: !!wallet.address,
    })),

  setConnecting: (connecting) =>
    set({ isConnecting: connecting }),

  disconnect: () =>
    set({
      address: null,
      provider: null,
      signer: null,
      chainId: null,
      isConnecting: false,
      isConnected: false,
    }),
}));
