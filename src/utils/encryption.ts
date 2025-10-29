import CryptoJS from 'crypto-js';

export class EncryptionUtil {
  private static readonly ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production';

  /**
   * Encrypt sensitive data (like seed phrases)
   */
  static encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt sensitive data
   */
  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        throw new Error('Decryption failed - invalid data or key');
      }
      
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Generate a secure encryption key
   */
  static generateEncryptionKey(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  /**
   * Hash data for storage (one-way)
   */
  static hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }
} 