import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, signInWithGoogle } from '../lib/firebase';
import { WalletManager } from '../lib/WalletManager';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  walletAddress: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    walletAddress: null
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (user) => {
        try {
          if (user) {
            // Get fresh ID token and create/get wallet
            const walletManager = WalletManager.getInstance();
            const walletData = await walletManager.createWallet(user);
            
            setAuthState((prev) => ({
              ...prev,
              user,
              loading: false,
              walletAddress: walletData.address
            }));

            toast.success('Successfully signed in!');
          } else {
            setAuthState((prev) => ({
              ...prev,
              user: null,
              loading: false,
              walletAddress: null
            }));
          }
        } catch (error: any) {
          console.error('Auth state change error:', error);
          setAuthState((prev) => ({
            ...prev,
            error: error.message,
            loading: false
          }));
          toast.error('Failed to load wallet information');
        }
      },
      (error) => {
        console.error('Auth state observer error:', error);
        setAuthState((prev) => ({
          ...prev,
          error: error.message,
          loading: false
        }));
        toast.error('Authentication error occurred');
      }
    );

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      setAuthState((prev) => ({ 
        ...prev, 
        loading: true, 
        error: null 
      }));
      
      const result = await signInWithGoogle();
      
      // Get wallet using the signed-in user
      const walletManager = WalletManager.getInstance();
      const walletData = await walletManager.createWallet(result.user);
      
      setAuthState((prev) => ({
        ...prev,
        user: result.user,
        walletAddress: walletData.address,
        loading: false
      }));

      toast.success('Successfully signed in!');
      return result;
    } catch (error: any) {
      console.error('Sign in error:', {
        name: error.name,
        message: error.message,
        code: error.code
      });
      
      const errorMessage = error.code === 'auth/configuration-not-found'
        ? 'Google sign-in is not properly configured'
        : error.message || 'Failed to sign in';
      
      setAuthState((prev) => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setAuthState((prev) => ({ 
        ...prev, 
        loading: true, 
        error: null 
      }));
      
      await auth.signOut();
      
      setAuthState({
        user: null,
        loading: false,
        error: null,
        walletAddress: null
      });

      toast.success('Successfully signed out');
    } catch (error: any) {
      console.error('Sign out error:', error);
      const errorMessage = error.message || 'Failed to sign out';
      
      setAuthState((prev) => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const isAdmin = (): boolean => {
    if (!authState.user) return false;
    // Implement your admin check logic here
    // Example: check custom claims, roles, etc.
    return false;
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    walletAddress: authState.walletAddress,
    signIn,
    signOut,
    isAdmin
  };
}; 