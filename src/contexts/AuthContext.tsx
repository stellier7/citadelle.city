import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, signInWithGoogle } from '../lib/firebase';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Clear state helper
  const clearState = () => {
    setUser(null);
  };

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          console.log('User authenticated:', user.uid);
          setUser(user);
        } else {
          console.log('User signed out');
          clearState();
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        clearState();
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sign in handler
  const signIn = async () => {
    try {
      setLoading(true);
      console.log('Initiating Google sign-in...');
      
      const result = await signInWithGoogle();
      if (!result.user) {
        throw new Error('No user data returned');
      }
      
      console.log('Google sign-in successful:', result.user.uid);
      setUser(result.user);
      
      toast.success('Successfully signed in!');
    } catch (error: any) {
      console.error('Sign in error:', {
        code: error.code,
        message: error.message
      });
      
      const errorMessage = error.code === 'auth/configuration-not-found'
        ? 'Google sign-in is not properly configured'
        : error.message || 'Failed to sign in';
      
      toast.error(errorMessage);
      clearState();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out handler
  const signOut = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      clearState();
      toast.success('Successfully signed out');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 
