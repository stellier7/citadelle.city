import { auth as adminAuth } from 'firebase-admin';
import { WalletManager } from '../../../lib/WalletManager';
import { db } from '../../db';

export interface WalletRequest {
  uid: string;
  email: string;
  displayName?: string;
}

export interface WalletResponse {
  walletAddress?: string;
  error?: {
    code: string;
    message: string;
  };
}

// Helper function to create JSON response
const createJsonResponse = (data: WalletResponse, status: number): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const createOrGetWallet = async (req: Request): Promise<Response> => {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return createJsonResponse(
        {
          error: {
            code: 'method-not-allowed',
            message: 'Only POST method is allowed'
          }
        },
        405
      );
    }

    // Extract the token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return createJsonResponse(
        {
          error: {
            code: 'auth/invalid-token',
            message: 'Missing or invalid authorization token'
          }
        },
        401
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    try {
      // Parse request body
      let body: WalletRequest;
      try {
        body = await req.json();
      } catch (parseError) {
        console.error('Failed to parse request body:', parseError);
        return createJsonResponse(
          {
            error: {
              code: 'invalid-request',
              message: 'Invalid request body format'
            }
          },
          400
        );
      }

      // Verify the Firebase ID token
      const decodedToken = await adminAuth().verifyIdToken(idToken);
      console.log('Token verified for user:', decodedToken.uid);

      // Verify user matches token
      if (decodedToken.uid !== body.uid) {
        return createJsonResponse(
          {
            error: {
              code: 'auth/user-mismatch',
              message: 'User ID does not match token'
            }
          },
          403
        );
      }

      // Check if wallet already exists
      try {
        const existingWallet = await db.collection('wallets')
          .where('userId', '==', decodedToken.uid)
          .limit(1)
          .get();

        if (!existingWallet.empty) {
          const walletData = existingWallet.docs[0].data();
          console.log('Retrieved existing wallet for user:', decodedToken.uid);
          return createJsonResponse(
            { walletAddress: walletData.address },
            200
          );
        }
      } catch (dbError) {
        console.error('Database query error:', dbError);
        return createJsonResponse(
          {
            error: {
              code: 'database/query-failed',
              message: 'Failed to check existing wallet'
            }
          },
          500
        );
      }

      // Create new wallet
      console.log('Creating new wallet for user:', decodedToken.uid);
      try {
        const walletManager = WalletManager.getInstance();
        const walletData = await walletManager.createWallet({
          uid: decodedToken.uid,
          email: body.email,
          displayName: body.displayName
        } as any);

        // Store wallet data
        await db.collection('wallets').add({
          userId: decodedToken.uid,
          address: walletData.address,
          encryptedSeedPhrase: walletData.encryptedSeedPhrase,
          createdAt: new Date(),
          isAdmin: walletData.isAdmin
        });

        console.log('Wallet created successfully for user:', decodedToken.uid);
        return createJsonResponse(
          { walletAddress: walletData.address },
          201
        );
      } catch (walletError) {
        console.error('Wallet creation error:', walletError);
        return createJsonResponse(
          {
            error: {
              code: 'wallet/creation-failed',
              message: 'Failed to create new wallet'
            }
          },
          500
        );
      }

    } catch (error: any) {
      console.error('Token verification or wallet creation error:', {
        error: error.message,
        stack: error.stack
      });

      if (error.code === 'auth/id-token-expired') {
        return createJsonResponse(
          {
            error: {
              code: 'auth/id-token-expired',
              message: 'Firebase ID token has expired. Get a fresh token and try again.'
            }
          },
          401
        );
      }

      return createJsonResponse(
        {
          error: {
            code: 'auth/token-verification-failed',
            message: error.message || 'Token verification failed'
          }
        },
        403
      );
    }

  } catch (error: any) {
    console.error('Wallet endpoint error:', {
      error: error.message,
      stack: error.stack
    });

    return createJsonResponse(
      {
        error: {
          code: 'server/internal-error',
          message: 'An unexpected error occurred'
        }
      },
      500
    );
  }
}; 