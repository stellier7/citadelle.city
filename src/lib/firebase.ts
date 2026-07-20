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

// Firebase configuration with fallback values for development
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