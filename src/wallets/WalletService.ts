import { ethers } from 'ethers';
import { EncryptionUtil } from '../utils/encryption';

export interface WalletData {
  address: string;
  privateKey: string;
  seedPhrase: string;
  encryptedSeedPhrase: string;
}

export interface StoredWallet {
  userId: string;
  walletData: WalletData;
  createdAt: Date;
  lastAccessed: Date;
}

export class WalletService {
  private static instance: WalletService;
  private wallets: Map<string, StoredWallet> = new Map();

  private constructor() {}

  static getInstance(): WalletService {
    if (!this.instance) {
      this.instance = new WalletService();
    }
    return this.instance;
  }

  /**
   * Generate a new wallet for a user
   */
  async generateWallet(userId: string): Promise<WalletData> {
    try {
      // Generate a new wallet with ethers
      const wallet = ethers.Wallet.createRandom();
      
      const walletData: WalletData = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        seedPhrase: wallet.mnemonic?.phrase || '',
        encryptedSeedPhrase: EncryptionUtil.encrypt(wallet.mnemonic?.phrase || '')
      };

      // Store wallet data
      const storedWallet: StoredWallet = {
        userId,
        walletData,
        createdAt: new Date(),
        lastAccessed: new Date()
      };

      this.wallets.set(userId, storedWallet);
      
      // In production, you would store this in a secure database
      this.persistWallet(userId, storedWallet);

      return walletData;
    } catch (error) {
      console.error('Failed to generate wallet:', error);
      throw new Error('Failed to generate wallet');
    }
  }

  /**
   * Get existing wallet for a user
   */
  async getWallet(userId: string): Promise<WalletData | null> {
    try {
      // Check in-memory cache first
      const storedWallet = this.wallets.get(userId);
      if (storedWallet) {
        storedWallet.lastAccessed = new Date();
        return storedWallet.walletData;
      }

      // In production, fetch from secure database
      const persistedWallet = await this.fetchWallet(userId);
      if (persistedWallet) {
        this.wallets.set(userId, persistedWallet);
        return persistedWallet.walletData;
      }

      return null;
    } catch (error) {
      console.error('Failed to get wallet:', error);
      return null;
    }
  }

  /**
   * Get or create wallet for a user
   */
  async getOrCreateWallet(userId: string): Promise<WalletData> {
    const existingWallet = await this.getWallet(userId);
    if (existingWallet) {
      return existingWallet;
    }

    return await this.generateWallet(userId);
  }

  /**
   * Get decrypted seed phrase for a user
   */
  async getSeedPhrase(userId: string): Promise<string | null> {
    try {
      const wallet = await this.getWallet(userId);
      if (!wallet) {
        return null;
      }

      return EncryptionUtil.decrypt(wallet.encryptedSeedPhrase);
    } catch (error) {
      console.error('Failed to get seed phrase:', error);
      return null;
    }
  }

  /**
   * Export wallet as JSON (like MetaMask)
   */
  async exportWallet(userId: string, password: string): Promise<string> {
    try {
      const wallet = await this.getWallet(userId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const ethersWallet = new ethers.Wallet(wallet.privateKey);
      const jsonWallet = await ethersWallet.encrypt(password);
      
      return jsonWallet;
    } catch (error) {
      console.error('Failed to export wallet:', error);
      throw new Error('Failed to export wallet');
    }
  }

  /**
   * Import wallet from JSON
   */
  async importWallet(userId: string, jsonWallet: string, password: string): Promise<WalletData> {
    try {
      const ethersWallet = await ethers.Wallet.fromEncryptedJson(jsonWallet, password);
      
      const walletData: WalletData = {
        address: ethersWallet.address,
        privateKey: ethersWallet.privateKey,
        seedPhrase: ethersWallet.mnemonic?.phrase || '',
        encryptedSeedPhrase: EncryptionUtil.encrypt(ethersWallet.mnemonic?.phrase || '')
      };

      // Store the imported wallet
      const storedWallet: StoredWallet = {
        userId,
        walletData,
        createdAt: new Date(),
        lastAccessed: new Date()
      };

      this.wallets.set(userId, storedWallet);
      this.persistWallet(userId, storedWallet);

      return walletData;
    } catch (error) {
      console.error('Failed to import wallet:', error);
      throw new Error('Failed to import wallet - invalid password or corrupted file');
    }
  }

  /**
   * Validate wallet address
   */
  static isValidAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(userId: string, provider: ethers.Provider): Promise<string> {
    try {
      const wallet = await this.getWallet(userId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const balance = await provider.getBalance(wallet.address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw new Error('Failed to get wallet balance');
    }
  }

  /**
   * Persist wallet to storage (in production, this would be a secure database)
   */
  private async persistWallet(userId: string, wallet: StoredWallet): Promise<void> {
    try {
      // In development, store in localStorage
      if (import.meta.env.DEV) {
        localStorage.setItem(`wallet_${userId}`, JSON.stringify(wallet));
      } else {
        // In production, send to secure backend
        await this.sendToBackend(userId, wallet);
      }
    } catch (error) {
      console.error('Failed to persist wallet:', error);
    }
  }

  /**
   * Fetch wallet from storage
   */
  private async fetchWallet(userId: string): Promise<StoredWallet | null> {
    try {
      // In development, fetch from localStorage
      if (import.meta.env.DEV) {
        const stored = localStorage.getItem(`wallet_${userId}`);
        if (stored) {
          const wallet = JSON.parse(stored);
          return {
            ...wallet,
            createdAt: new Date(wallet.createdAt),
            lastAccessed: new Date(wallet.lastAccessed)
          };
        }
      } else {
        // In production, fetch from secure backend
        return await this.fetchFromBackend(userId);
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
      return null;
    }
  }

  /**
   * Send wallet to backend (production only)
   */
  private async sendToBackend(userId: string, wallet: StoredWallet): Promise<void> {
    // Implementation for production backend
    console.log('Sending wallet to backend for user:', userId);
  }

  /**
   * Fetch wallet from backend (production only)
   */
  private async fetchFromBackend(userId: string): Promise<StoredWallet | null> {
    // Implementation for production backend
    console.log('Fetching wallet from backend for user:', userId);
    return null;
  }
} 