import { Web3Auth } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { TorusEVMAdapter } from '@web3auth/torus-evm-adapter';
import { ethers } from 'ethers';
import { WalletService, WalletData } from './WalletService';

export interface Web3AuthConfig {
  clientId: string;
  web3AuthNetwork: 'mainnet' | 'testnet' | 'cyan';
  chainConfig: {
    chainNamespace: string;
    chainId: string;
    rpcTarget: string;
    displayName: string;
    blockExplorer: string;
    ticker: string;
    tickerName: string;
  };
}

export class Web3AuthService {
  private static instance: Web3AuthService;
  private web3auth: Web3Auth | null = null;
  private walletService: WalletService;
  private config: Web3AuthConfig;

  private constructor() {
    this.walletService = WalletService.getInstance();
    this.config = {
      clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      web3AuthNetwork: 'testnet',
      chainConfig: {
        chainNamespace: 'eip155',
        chainId: '0xaa36a7', // Sepolia
        rpcTarget: 'https://rpc.sepolia.org',
        displayName: 'Sepolia Testnet',
        blockExplorer: 'https://sepolia.etherscan.io',
        ticker: 'ETH',
        tickerName: 'Ethereum'
      }
    };
  }

  static getInstance(): Web3AuthService {
    if (!this.instance) {
      this.instance = new Web3AuthService();
    }
    return this.instance;
  }

  /**
   * Initialize Web3Auth
   */
  async initialize(): Promise<void> {
    try {
      this.web3auth = new Web3Auth({
        clientId: this.config.clientId,
        web3AuthNetwork: this.config.web3AuthNetwork,
        chainConfig: this.config.chainConfig
      });

      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: 'default'
        },
        adapterSettings: {
          whiteLabel: {
            name: 'Citadelle',
            logoLight: 'https://web3auth.io/images/web3auth-logo.svg',
            logoDark: 'https://web3auth.io/images/web3auth-logo.svg',
            defaultLanguage: 'en',
            dark: true
          }
        }
      });

      const torusAdapter = new TorusEVMAdapter({
        torusWalletOpts: {},
        walletConnectOptions: {}
      });

      this.web3auth.configureAdapter(openloginAdapter);
      this.web3auth.configureAdapter(torusAdapter);

      await this.web3auth.initModal();
    } catch (error) {
      console.error('Failed to initialize Web3Auth:', error);
      throw new Error('Failed to initialize Web3Auth');
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<WalletData> {
    try {
      if (!this.web3auth) {
        await this.initialize();
      }

      if (!this.web3auth) {
        throw new Error('Web3Auth not initialized');
      }

      // Connect to Web3Auth
      const web3authProvider = await this.web3auth.connect();
      
      if (!web3authProvider) {
        throw new Error('Failed to connect to Web3Auth');
      }

      // Get user info
      const user = await this.web3auth.getUserInfo();
      
      if (!user.email) {
        throw new Error('No email found in user info');
      }

      // Generate or get wallet for this user
      const walletData = await this.walletService.getOrCreateWallet(user.email);
      
      return walletData;
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw new Error('Failed to sign in with Google');
    }
  }

  /**
   * Sign in with Apple
   */
  async signInWithApple(): Promise<WalletData> {
    try {
      if (!this.web3auth) {
        await this.initialize();
      }

      if (!this.web3auth) {
        throw new Error('Web3Auth not initialized');
      }

      // Connect to Web3Auth with Apple
      const web3authProvider = await this.web3auth.connectTo('openlogin', {
        loginProvider: 'apple'
      });
      
      if (!web3authProvider) {
        throw new Error('Failed to connect to Web3Auth');
      }

      // Get user info
      const user = await this.web3auth.getUserInfo();
      
      if (!user.email) {
        throw new Error('No email found in user info');
      }

      // Generate or get wallet for this user
      const walletData = await this.walletService.getOrCreateWallet(user.email);
      
      return walletData;
    } catch (error) {
      console.error('Apple sign-in failed:', error);
      throw new Error('Failed to sign in with Apple');
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      if (this.web3auth) {
        await this.web3auth.logout();
      }
    } catch (error) {
      console.error('Sign out failed:', error);
      throw new Error('Failed to sign out');
    }
  }

  /**
   * Get user info
   */
  async getUserInfo(): Promise<any> {
    try {
      if (!this.web3auth) {
        throw new Error('Web3Auth not initialized');
      }

      return await this.web3auth.getUserInfo();
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  }

  /**
   * Check if user is connected
   */
  async isConnected(): Promise<boolean> {
    try {
      if (!this.web3auth) {
        return false;
      }

      return this.web3auth.status === 'connected';
    } catch (error) {
      console.error('Failed to check connection status:', error);
      return false;
    }
  }

  /**
   * Get provider for transactions
   */
  async getProvider(): Promise<ethers.Provider | null> {
    try {
      if (!this.web3auth) {
        return null;
      }

      const provider = await this.web3auth.connect();
      if (!provider) {
        return null;
      }

      return new ethers.BrowserProvider(provider);
    } catch (error) {
      console.error('Failed to get provider:', error);
      return null;
    }
  }
} 