import { useState, useEffect, useCallback } from 'react';
import { useConnect, useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import { sepolia } from 'viem/chains';
import { toast } from 'react-hot-toast';
import { WalletService, WalletData } from '../wallets/WalletService';
import { Web3AuthService } from '../wallets/Web3AuthService';

export interface WalletState {
  // Social login wallets
  socialWallet: WalletData | null;
  socialWalletLoading: boolean;
  
  // External wallets (MetaMask, etc.)
  externalWallet: string | null;
  externalWalletLoading: boolean;
  
  // General state
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface WalletActions {
  // Social login actions
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOutSocial: () => Promise<void>;
  
  // External wallet actions
  connectMetaMask: () => Promise<void>;
  connectCoinbase: () => Promise<void>;
  connectPhantom: () => Promise<void>;
  disconnectExternal: () => Promise<void>;
  
  // Wallet management
  getSeedPhrase: () => Promise<string | null>;
  exportWallet: (password: string) => Promise<string>;
  importWallet: (jsonWallet: string, password: string) => Promise<void>;
  
  // Utility
  clearError: () => void;
}

export const useWallet = (): WalletState & WalletActions => {
  const [socialWallet, setSocialWallet] = useState<WalletData | null>(null);
  const [socialWalletLoading, setSocialWalletLoading] = useState(false);
  const [externalWallet, setExternalWallet] = useState<string | null>(null);
  const [externalWalletLoading, setExternalWalletLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wagmi hooks
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  // Services
  const walletService = WalletService.getInstance();
  const web3AuthService = Web3AuthService.getInstance();

  // Update external wallet when wagmi address changes
  useEffect(() => {
    setExternalWallet(address || null);
  }, [address]);

  // Check if wallets are installed
  const isMetaMaskInstalled = typeof window !== 'undefined' && window.ethereum?.isMetaMask;
  const isCoinbaseInstalled = typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet;
  const isPhantomInstalled = typeof window !== 'undefined' && window.solana?.isPhantom;

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Social login actions
  const signInWithGoogle = useCallback(async () => {
    try {
      setSocialWalletLoading(true);
      setError(null);

      const walletData = await web3AuthService.signInWithGoogle();
      setSocialWallet(walletData);
      
      toast.success('Successfully signed in with Google!');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setError(error.message || 'Failed to sign in with Google');
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setSocialWalletLoading(false);
    }
  }, [web3AuthService]);

  const signInWithApple = useCallback(async () => {
    try {
      setSocialWalletLoading(true);
      setError(null);

      const walletData = await web3AuthService.signInWithApple();
      setSocialWallet(walletData);
      
      toast.success('Successfully signed in with Apple!');
    } catch (error: any) {
      console.error('Apple sign-in error:', error);
      setError(error.message || 'Failed to sign in with Apple');
      toast.error(error.message || 'Failed to sign in with Apple');
    } finally {
      setSocialWalletLoading(false);
    }
  }, [web3AuthService]);

  const signOutSocial = useCallback(async () => {
    try {
      setSocialWalletLoading(true);
      setError(null);

      await web3AuthService.signOut();
      setSocialWallet(null);
      
      toast.success('Successfully signed out!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError(error.message || 'Failed to sign out');
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setSocialWalletLoading(false);
    }
  }, [web3AuthService]);

  // External wallet actions
  const connectMetaMask = useCallback(async () => {
    try {
      setExternalWalletLoading(true);
      setError(null);

      if (!isMetaMaskInstalled) {
        throw new Error('MetaMask not installed. Please install MetaMask extension.');
      }

      const metamaskConnector = connectors.find(c => c.id === 'metaMask');
      if (!metamaskConnector) {
        throw new Error('MetaMask connector not found');
      }

      await connect({ connector: metamaskConnector });

      // Switch to Sepolia if needed
      try {
        await switchChain({ chainId: sepolia.id });
      } catch (switchError) {
        console.warn('Failed to switch to Sepolia:', switchError);
      }

      toast.success('Successfully connected to MetaMask!');
    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      setError(error.message || 'Failed to connect to MetaMask');
      toast.error(error.message || 'Failed to connect to MetaMask');
    } finally {
      setExternalWalletLoading(false);
    }
  }, [connect, connectors, switchChain, isMetaMaskInstalled]);

  const connectCoinbase = useCallback(async () => {
    try {
      setExternalWalletLoading(true);
      setError(null);

      const coinbaseConnector = connectors.find(c => c.id === 'coinbaseWallet');
      if (!coinbaseConnector) {
        throw new Error('Coinbase Wallet connector not found');
      }

      await connect({ connector: coinbaseConnector });

      // Switch to Sepolia if needed
      try {
        await switchChain({ chainId: sepolia.id });
      } catch (switchError) {
        console.warn('Failed to switch to Sepolia:', switchError);
      }

      toast.success('Successfully connected to Coinbase Wallet!');
    } catch (error: any) {
      console.error('Coinbase Wallet connection error:', error);
      setError(error.message || 'Failed to connect to Coinbase Wallet');
      toast.error(error.message || 'Failed to connect to Coinbase Wallet');
    } finally {
      setExternalWalletLoading(false);
    }
  }, [connect, connectors, switchChain]);

  const connectPhantom = useCallback(async () => {
    try {
      setExternalWalletLoading(true);
      setError(null);

      if (!isPhantomInstalled) {
        throw new Error('Phantom not installed. Please install Phantom extension.');
      }

      // For Solana wallets, you'd need a different connector
      // This is a placeholder for now
      throw new Error('Phantom (Solana) support not implemented yet');
    } catch (error: any) {
      console.error('Phantom connection error:', error);
      setError(error.message || 'Failed to connect to Phantom');
      toast.error(error.message || 'Failed to connect to Phantom');
    } finally {
      setExternalWalletLoading(false);
    }
  }, [isPhantomInstalled]);

  const disconnectExternal = useCallback(async () => {
    try {
      setExternalWalletLoading(true);
      setError(null);

      await disconnect();
      setExternalWallet(null);
      
      toast.success('Successfully disconnected!');
    } catch (error: any) {
      console.error('Disconnect error:', error);
      setError(error.message || 'Failed to disconnect');
      toast.error(error.message || 'Failed to disconnect');
    } finally {
      setExternalWalletLoading(false);
    }
  }, [disconnect]);

  // Wallet management actions
  const getSeedPhrase = useCallback(async (): Promise<string | null> => {
    try {
      if (!socialWallet) {
        throw new Error('No social wallet connected');
      }

      // Get the user ID from the social wallet (you might need to adjust this)
      const userId = socialWallet.address; // This is a placeholder
      return await walletService.getSeedPhrase(userId);
    } catch (error: any) {
      console.error('Failed to get seed phrase:', error);
      setError(error.message || 'Failed to get seed phrase');
      return null;
    }
  }, [socialWallet, walletService]);

  const exportWallet = useCallback(async (password: string): Promise<string> => {
    try {
      if (!socialWallet) {
        throw new Error('No social wallet connected');
      }

      const userId = socialWallet.address; // This is a placeholder
      return await walletService.exportWallet(userId, password);
    } catch (error: any) {
      console.error('Failed to export wallet:', error);
      setError(error.message || 'Failed to export wallet');
      throw error;
    }
  }, [socialWallet, walletService]);

  const importWallet = useCallback(async (jsonWallet: string, password: string): Promise<void> => {
    try {
      setSocialWalletLoading(true);
      setError(null);

      // You'll need to determine the user ID for the imported wallet
      const userId = 'imported-user'; // This is a placeholder
      const walletData = await walletService.importWallet(userId, jsonWallet, password);
      setSocialWallet(walletData);
      
      toast.success('Successfully imported wallet!');
    } catch (error: any) {
      console.error('Failed to import wallet:', error);
      setError(error.message || 'Failed to import wallet');
      toast.error(error.message || 'Failed to import wallet');
    } finally {
      setSocialWalletLoading(false);
    }
  }, [walletService]);

  // Computed state
  const isConnected = !!(socialWallet || externalWallet);
  const isLoading = socialWalletLoading || externalWalletLoading;

  return {
    // State
    socialWallet,
    socialWalletLoading,
    externalWallet,
    externalWalletLoading,
    isConnected,
    isLoading,
    error,

    // Actions
    signInWithGoogle,
    signInWithApple,
    signOutSocial,
    connectMetaMask,
    connectCoinbase,
    connectPhantom,
    disconnectExternal,
    getSeedPhrase,
    exportWallet,
    importWallet,
    clearError
  };
}; 