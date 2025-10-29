import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Check required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

const missingEnvVars = requiredEnvVars.filter(
  key => !import.meta.env[key]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required Firebase environment variables: ${missingEnvVars.join(', ')}`
  );
}

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app: FirebaseApp;
let auth: Auth;
let analytics: Analytics | null = null;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication
  auth = getAuth(app);
  
  // Initialize Firebase Analytics conditionally
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  }).catch(error => {
    console.warn('Firebase Analytics not supported:', error);
  });
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { app as default, auth, analytics }; 