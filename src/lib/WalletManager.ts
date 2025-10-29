import { User } from 'firebase/auth';

interface WalletResponse {
  address: string;
  seedPhrase?: string;
}

export class WalletManager {
  private static instance: WalletManager;
  private readonly API_BASE_URL: string;

  private constructor() {
    this.API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  }

  static getInstance(): WalletManager {
    if (!this.instance) {
      this.instance = new WalletManager();
    }
    return this.instance;
  }

  /**
   * Create or get a wallet for the authenticated user
   */
  async createWallet(user: User): Promise<WalletResponse> {
    try {
      // In development mode, generate a deterministic wallet
      if (import.meta.env.DEV) {
        console.log('Development mode: Generating deterministic wallet');
        const deterministicAddress = this.generateDeterministicAddress(user.uid);
        return {
          address: deterministicAddress,
          seedPhrase: 'development-seed-phrase-not-for-production'
        };
      }

      // Get fresh ID token
      const idToken = await user.getIdToken(true);

      // Call wallet creation API
      const response = await fetch(`${this.API_BASE_URL}/api/createWallet`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to create wallet' }));
        throw new Error(error.error || 'Failed to create wallet');
      }

      const data = await response.json();
      return data as WalletResponse;
    } catch (error: any) {
      console.error('Error creating wallet:', error);
      
      // Fallback: generate deterministic wallet
      console.log('Using fallback wallet generation');
      const fallbackAddress = this.generateDeterministicAddress(user.uid);
      return {
        address: fallbackAddress,
        seedPhrase: 'fallback-seed-phrase'
      };
    }
  }

  /**
   * Generate a deterministic wallet address based on user ID
   */
  private generateDeterministicAddress(userId: string): string {
    // Create a deterministic address based on user ID
    const hash = this.simpleHash(userId);
    const address = `0x${hash.slice(0, 40).padEnd(40, '0')}`;
    return address;
  }

  /**
   * Simple hash function for deterministic address generation
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  async getSeedPhrase(user: User): Promise<string | null> {
    try {
      // In development mode, return a mock seed phrase
      if (import.meta.env.DEV) {
        return 'development seed phrase for testing purposes only';
      }

      // Get fresh ID token
      const idToken = await user.getIdToken(true);
      
      const response = await fetch('/api/auth/wallet/seed', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: {
            message: 'Failed to retrieve seed phrase'
          }
        }));
        throw new Error(error.error.message);
      }

      const data = await response.json();
      return data.seedPhrase || null;
    } catch (error: any) {
      console.error('Error getting seed phrase:', error);
      throw new Error(
        'Unable to retrieve seed phrase. Please check your permissions.'
      );
    }
  }

  private isAuthorized(user: User): boolean {
    // Implement your authorization logic
    return true; // Allow all authenticated users for now
  }
} 