import { Wallet } from 'ethers';
import { db } from '../firebase-admin';
import * as crypto from 'crypto';

interface WalletData {
  address: string;
  encryptedSeedPhrase: string;
  createdAt: Date;
  lastAccessedAt: Date;
}

export class WalletService {
  private static instance: WalletService;

  private constructor() {
    // Empty constructor
  }

  static getInstance(): WalletService {
    if (!this.instance) {
      this.instance = new WalletService();
    }
    return this.instance;
  }

  /**
   * Get or create a wallet for a user
   */
  async getOrCreateWallet(userId: string): Promise<string> {
    try {
      // Check if wallet exists
      const existingWallet = await this.getWalletByUserId(userId);
      if (existingWallet) {
        // Update last accessed timestamp
        await this.updateLastAccessed(userId);
        return existingWallet.address;
      }

      // Create new wallet if none exists
      const wallet = Wallet.createRandom();
      const encryptedSeedPhrase = await this.encryptSeedPhrase(wallet.mnemonic.phrase);

      // Store wallet data
      const walletData: WalletData = {
        address: wallet.address,
        encryptedSeedPhrase,
        createdAt: new Date(),
        lastAccessedAt: new Date()
      };

      await this.saveWallet(userId, walletData);
      return wallet.address;
    } catch (error) {
      console.error('Error in getOrCreateWallet:', error);
      throw new Error('Failed to get or create wallet');
    }
  }

  /**
   * Get wallet by user ID
   */
  private async getWalletByUserId(userId: string): Promise<WalletData | null> {
    try {
      const walletDoc = await db.collection('wallets')
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (walletDoc.empty) {
        return null;
      }

      return walletDoc.docs[0].data() as WalletData;
    } catch (error) {
      console.error('Error getting wallet:', error);
      throw new Error('Failed to retrieve wallet');
    }
  }

  /**
   * Save wallet data to Firestore
   */
  private async saveWallet(userId: string, walletData: WalletData): Promise<void> {
    try {
      await db.collection('wallets').doc(userId).set({
        ...walletData,
        userId
      });
    } catch (error) {
      console.error('Error saving wallet:', error);
      throw new Error('Failed to save wallet');
    }
  }

  /**
   * Update last accessed timestamp
   */
  private async updateLastAccessed(userId: string): Promise<void> {
    try {
      await db.collection('wallets').doc(userId).update({
        lastAccessedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating last accessed:', error);
      // Non-critical error, don't throw
    }
  }

  /**
   * Encrypt seed phrase
   * Note: In production, use a more secure encryption method and key management
   */
  private async encryptSeedPhrase(seedPhrase: string): Promise<string> {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(seedPhrase, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}:${key.toString('hex')}`;
  }

  static generateWallet(): { address: string; privateKey: string } {
    const wallet = Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey
    };
  }
} 