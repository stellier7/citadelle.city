import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  Auth,
  GoogleAuthProvider, 
  OAuthProvider,
  signInWithPopup,
  UserCredential,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Verify required environment variables
const REQUIRED_ENV_VARS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

const missingVars = REQUIRED_ENV_VARS.filter(key => !import.meta.env[key]);
if (missingVars.length > 0) {
  throw new Error(`Missing Firebase config: ${missingVars.join(', ')}`);
}

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef'
};

// Initialize Firebase only if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth: Auth = getAuth(app);

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Configure providers
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

appleProvider.addScope('email');
appleProvider.addScope('name');

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // After successful sign-in, create/get wallet on backend
    const idToken = await result.user.getIdToken();
    await createOrGetWallet(result.user, idToken);
    
    return result;
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    if (error.code === 'auth/configuration-not-found') {
      throw new Error('Firebase Google Auth is not properly configured. Please check Firebase Console settings.');
    }
    throw error;
  }
};

// Sign in with Apple
export const signInWithApple = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    return result;
  } catch (error) {
    console.error('Error signing in with Apple:', error);
    throw error;
  }
};

// Create or get wallet for user
const createOrGetWallet = async (user: User, idToken: string) => {
  try {
    console.log('Initiating wallet creation/retrieval for user:', user.uid);
    
    // In development, just return a mock wallet address
    if (import.meta.env.DEV) {
      console.log('Development mode: Returning mock wallet address');
      return '0x0000000000000000000000000000000000000000';
    }
    
    const response = await fetch('/api/auth/wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      })
    });

    console.log('Wallet API response status:', response.status);
    
    // First try to get the response as text
    const responseText = await response.text();
    console.log('Wallet API raw response:', responseText);

    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse wallet response as JSON:', parseError);
      throw new Error(
        responseText || 'Something went wrong. Please try again.'
      );
    }

    // Check if response was successful
    if (!response.ok) {
      console.error('Wallet creation failed:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error
      });
      
      throw new Error(
        data.error?.message || 
        'Failed to create wallet. Please try again.'
      );
    }

    // Validate wallet address exists
    if (!data.walletAddress) {
      console.error('Invalid wallet data received:', data);
      throw new Error('Invalid wallet data received from server');
    }

    console.log('Wallet created/retrieved successfully:', data.walletAddress);
    return data.walletAddress;
  } catch (error: any) {
    console.error('Wallet creation error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      user: user.uid
    });
    
    // Provide a user-friendly error message
    throw new Error(
      error.message || 'Unable to create wallet. Please try again later.'
    );
  }
};

// Auth state observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Export providers for direct use if needed
export const providers = {
  google: googleProvider,
  apple: appleProvider
};

export { auth, app as default }; 