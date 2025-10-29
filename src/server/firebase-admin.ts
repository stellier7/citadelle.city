import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // Add your Firebase project configuration here
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export const auth = admin.auth();
export const db = admin.firestore();

// Helper function to verify Firebase ID token
export async function verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
  try {
    return await auth.verifyIdToken(token);
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid or expired token');
  }
} 