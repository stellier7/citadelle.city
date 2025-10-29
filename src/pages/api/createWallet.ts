import { NextApiRequest, NextApiResponse } from 'next';
import { verifyIdToken } from '../../server/firebase-admin';
import { WalletService } from '../../server/services/WalletService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    // Extract and verify token
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyIdToken(token);

    // Get or create wallet
    const walletService = WalletService.getInstance();
    const walletAddress = await walletService.getOrCreateWallet(decodedToken.uid);

    // Return wallet address
    return res.status(200).json({ address: walletAddress });
  } catch (error: any) {
    console.error('Error in createWallet API:', error);
    
    // Handle specific error types
    if (error.message === 'Invalid or expired token') {
      return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Failed to create/get wallet' });
  }
} 