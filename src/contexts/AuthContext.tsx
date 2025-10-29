import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, signInWithGoogle } from '../lib/firebase';
import { WalletManager } from '../lib/WalletManager';
import { toast } from 'react-hot-toast';
import { useConnect, useAccount, useChainId, useSwitchChain, useDisconnect } from 'wagmi';
import { sepolia } from 'viem/chains';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  walletAddress: string | null;
  metamaskAddress: string | null;
  connectedWalletType: string | null;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  connectMetaMask: () => Promise<void>;
  connectCoinbase: () => Promise<void>;
  connectPhantom: () => Promise<void>;
  disconnectMetaMask: () => Promise<void>;
  disconnectCoinbase: () => Promise<void>;
  disconnectPhantom: () => Promise<void>;
  refreshWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [metamaskAddress, setMetamaskAddress] = useState<string | null>(null);
  const [connectedWalletType, setConnectedWalletType] = useState<string | null>(null);

  // Wagmi hooks with error handling
  let connect: any;
  let connectors: readonly any[] = [];
  let address: string | null = null;
  let chainId: number = 11155111; // Sepolia
  let switchChain: any;
  let isConnected: boolean = false;
  let connector: any = null;
  let disconnect: any;

  try {
    const wagmiHooks = useConnect();
    const accountHooks = useAccount();
    const chainIdHooks = useChainId();
    const switchChainHooks = useSwitchChain();
    const disconnectHook = useDisconnect();
    
    connect = wagmiHooks.connect;
    connectors = wagmiHooks.connectors;
    address = accountHooks.address || null;
    isConnected = accountHooks.isConnected;
    connector = accountHooks.connector;
    chainId = chainIdHooks;
    switchChain = switchChainHooks.switchChain;
    disconnect = disconnectHook.disconnect;
  } catch (error) {
    console.warn('Wagmi hooks not available:', error);
    // Fallback mock functions
    connect = () => Promise.reject(new Error('Wagmi not available'));
    switchChain = () => Promise.reject(new Error('Wagmi not available'));
    disconnect = () => Promise.reject(new Error('Wagmi not available'));
  }

  // Effect to sync wagmi's connection status with AuthContext state
  useEffect(() => {
    setMetamaskAddress(address || null);

    if (isConnected && connector) {
      const name = connector.name.toLowerCase();
      if (name.includes('metamask')) {
        setConnectedWalletType('MetaMask');
      } else if (name.includes('coinbase')) {
        setConnectedWalletType('Coinbase');
      } else if (name.includes('phantom')) {
        setConnectedWalletType('Phantom');
      } else {
        // Fallback for other injected wallets
        setConnectedWalletType(connector.name);
      }
    } else if (!isConnected) {
      setConnectedWalletType(null);
    }
  }, [address, isConnected, connector]);

  // Clear state helper
  const clearState = () => {
    setUser(null);
    setWalletAddress(null);
    setMetamaskAddress(null);
    setConnectedWalletType(null);
  };

  // Connect to MetaMask
  const connectMetaMask = async () => {
    try {
      console.log('Connecting to MetaMask...');
      console.log('Available connectors:', connectors);
      
      // Debug: Log all connector details
      connectors.forEach((connector, index) => {
        console.log(`Connector ${index}:`, {
          id: connector.id,
          name: connector.name,
          ready: connector.ready,
          type: connector.type
        });
      });
      
      if (!window.ethereum) {
        throw new Error('MetaMask not found. Please install MetaMask extension.');
      }

      // Check if wagmi is properly initialized
      if (!connectors || connectors.length === 0) {
        throw new Error('Wallet connectors not initialized. Please try again.');
      }

      // Find MetaMask connector - try different possible IDs
      let metamaskConnector = connectors.find(c => c.id === 'injected');
      if (!metamaskConnector) {
        metamaskConnector = connectors.find(c => c.id === 'metaMask');
      }
      if (!metamaskConnector) {
        metamaskConnector = connectors.find(c => c.name === 'MetaMask');
      }
      if (!metamaskConnector) {
        metamaskConnector = connectors.find(c => c.name?.toLowerCase().includes('metamask'));
      }
      if (!metamaskConnector) {
        metamaskConnector = connectors.find(c => c.name?.toLowerCase().includes('injected'));
      }
      
      console.log('MetaMask connector found:', metamaskConnector);
      
      if (!metamaskConnector) {
        console.error('Available connector IDs:', connectors.map(c => c.id));
        console.error('Available connector names:', connectors.map(c => c.name));
        throw new Error('MetaMask connector not found');
      }

      // Connect using wagmi
      await connect({ connector: metamaskConnector });

      // Switch to Sepolia if needed
      if (chainId !== sepolia.id) {
        await switchChain({ chainId: sepolia.id });
      }

      setMetamaskAddress(address || null);
      setConnectedWalletType('MetaMask');
      toast.success('Successfully connected to MetaMask');
    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      toast.error(error.message || 'Failed to connect to MetaMask');
      throw error;
    }
  };

  // Connect to Coinbase
  const connectCoinbase = async () => {
    try {
      console.log('Connecting to Coinbase Wallet...');
      console.log('Available connectors:', connectors);
      
      // Debug: Log all connector details
      connectors.forEach((connector, index) => {
        console.log(`Connector ${index}:`, {
          id: connector.id,
          name: connector.name,
          ready: connector.ready,
          type: connector.type
        });
      });

      if (!connectors || connectors.length === 0) {
        throw new Error('Wallet connectors not initialized. Please try again.');
      }

      // Find Coinbase connector - try different possible IDs
      let coinbaseConnector = connectors.find(c => c.id === 'coinbaseWallet');
      if (!coinbaseConnector) {
        coinbaseConnector = connectors.find(c => c.name === 'Coinbase Wallet');
      }
      if (!coinbaseConnector) {
        coinbaseConnector = connectors.find(c => c.name?.toLowerCase().includes('coinbase'));
      }
      
      console.log('Coinbase connector found:', coinbaseConnector);
      
      if (!coinbaseConnector) {
        console.error('Available connector IDs:', connectors.map(c => c.id));
        console.error('Available connector names:', connectors.map(c => c.name));
        throw new Error('Coinbase Wallet connector not found');
      }

      await connect({ connector: coinbaseConnector });
      if (chainId !== sepolia.id) {
        await switchChain({ chainId: sepolia.id });
      }
      setConnectedWalletType('Coinbase');
      toast.success('Successfully connected to Coinbase Wallet');
    } catch (error: any) {
      console.error('Coinbase connection error:', error);
      toast.error(error.message || 'Failed to connect to Coinbase Wallet');
      throw error;
    }
  };

  // Connect to Phantom
  const connectPhantom = async () => {
    try {
      console.log('Connecting to Phantom...');
      console.log('Available connectors:', connectors);
      
      // Debug: Log all connector details
      connectors.forEach((connector, index) => {
        console.log(`Connector ${index}:`, {
          id: connector.id,
          name: connector.name,
          ready: connector.ready,
          type: connector.type
        });
      });

      if (!connectors || connectors.length === 0) {
        throw new Error('Wallet connectors not initialized. Please try again.');
      }

      // Find Phantom connector - try different possible IDs
      let phantomConnector = connectors.find(c => c.id === 'phantom');
      if (!phantomConnector) {
        phantomConnector = connectors.find(c => c.name === 'Phantom');
      }
      if (!phantomConnector) {
        phantomConnector = connectors.find(c => c.name?.toLowerCase().includes('phantom'));
      }
      
      console.log('Phantom connector found:', phantomConnector);
      
      if (!phantomConnector) {
        console.error('Available connector IDs:', connectors.map(c => c.id));
        console.error('Available connector names:', connectors.map(c => c.name));
        throw new Error('Phantom connector not found. Please install the Phantom extension.');
      }

      await connect({ connector: phantomConnector });
      if (chainId !== sepolia.id) {
        await switchChain({ chainId: sepolia.id });
      }
      setConnectedWalletType('Phantom');
      // Ensure the address is set for Phantom as well
      if (address) {
        setMetamaskAddress(address);
      }
      toast.success('Successfully connected to Phantom');
    } catch (error: any) {
      console.error('Phantom connection error:', error);
      toast.error(error.message || 'Failed to connect to Phantom');
      throw error;
    }
  };

  // Disconnect MetaMask
  const disconnectMetaMask = async () => {
    try {
      disconnect();
      toast.success('MetaMask disconnected');
    } catch (error: any) {
      console.error('MetaMask disconnect error:', error);
      toast.error(error.message || 'Failed to disconnect MetaMask');
      throw error;
    }
  };

  // Disconnect Coinbase
  const disconnectCoinbase = async () => {
    try {
      disconnect();
      toast.success('Coinbase Wallet disconnected');
    } catch (error: any) {
      console.error('Coinbase disconnect error:', error);
      toast.error(error.message || 'Failed to disconnect Coinbase Wallet');
      throw error;
    }
  };

  // Disconnect Phantom
  const disconnectPhantom = async () => {
    try {
      disconnect();
      toast.success('Phantom disconnected');
    } catch (error: any) {
      console.error('Phantom disconnect error:', error);
      toast.error(error.message || 'Failed to disconnect Phantom');
      throw error;
    }
  };

  // Generate or fetch wallet for user
  const generateWallet = async (currentUser: User) => {
    try {
      console.log('Generating wallet for user:', currentUser.uid);
      
      // In development mode, generate a mock wallet
      if (import.meta.env.DEV) {
        const mockAddress = `0x${currentUser.uid.slice(0, 40).padEnd(40, '0')}`;
        console.log('Development mode: Generated mock wallet:', mockAddress);
        setWalletAddress(mockAddress);
        return mockAddress;
      }

      // In production, use the WalletManager
      const walletManager = WalletManager.getInstance();
      const walletData = await walletManager.createWallet(currentUser);
      setWalletAddress(walletData.address);

      console.log('Wallet generated successfully:', walletData.address);
      toast.success('Wallet generated successfully!');
      
      return walletData.address;
    } catch (error: any) {
      console.error('Failed to generate wallet:', error);
      
      // Fallback: generate a deterministic wallet based on user ID
      const fallbackAddress = `0x${currentUser.uid.slice(0, 40).padEnd(40, '0')}`;
      console.log('Using fallback wallet:', fallbackAddress);
      setWalletAddress(fallbackAddress);
      
      toast.error('Using fallback wallet. Some features may be limited.');
      return fallbackAddress;
    }
  };

  // Fetch wallet for user
  const fetchWallet = async (currentUser: User) => {
    try {
      await generateWallet(currentUser);

      // Try to connect MetaMask if available and not already connected
      if (window.ethereum && !metamaskAddress) {
        try {
        await connectMetaMask();
        } catch (error) {
          console.log('MetaMask connection failed, continuing without it');
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch wallet:', error);
      toast.error('Failed to load wallet information');
      setWalletAddress(null);
    }
  };

  // Refresh wallet data
  const refreshWallet = async () => {
    if (!user) return;
    await fetchWallet(user);
  };

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          console.log('User authenticated:', user.uid);
          setUser(user);
          await fetchWallet(user);
        } else {
          console.log('User signed out');
          clearState();
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        clearState();
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Debug: Log available connectors on mount
  useEffect(() => {
    if (connectors && connectors.length > 0) {
      console.log('Available wagmi connectors:', connectors.map(c => ({
        id: c.id,
        name: c.name,
        ready: c.ready,
        type: c.type
      })));
    }
  }, [connectors]);

  // Sign in handler
  const signIn = async () => {
    try {
      setLoading(true);
      console.log('Initiating Google sign-in...');
      
      const result = await signInWithGoogle();
      if (!result.user) {
        throw new Error('No user data returned');
      }
      
      console.log('Google sign-in successful:', result.user.uid);
      setUser(result.user);
      
      // Generate wallet after successful sign-in
      await generateWallet(result.user);
      
      toast.success('Successfully signed in and wallet generated!');
    } catch (error: any) {
      console.error('Sign in error:', {
        code: error.code,
        message: error.message
      });
      
      const errorMessage = error.code === 'auth/configuration-not-found'
        ? 'Google sign-in is not properly configured'
        : error.message || 'Failed to sign in';
      
      toast.error(errorMessage);
      clearState();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out handler
  const signOut = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      clearState();
      toast.success('Successfully signed out');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        walletAddress,
        metamaskAddress,
        connectedWalletType,
        isAuthenticated: !!user,
        signIn,
        signOut,
        connectMetaMask,
        connectCoinbase,
        connectPhantom,
        disconnectMetaMask,
        disconnectCoinbase,
        disconnectPhantom,
        refreshWallet
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 
