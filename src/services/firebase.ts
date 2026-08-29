import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Helper to safely access env vars in both Vite (import.meta.env) and Node/test environments (process.env)
const getEnv = (key: string, fallback: string = ''): string => {
  const meta = typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: Record<string, string> }) : undefined;
  if (meta?.env && meta.env[key]) {
    return meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
};

// Firebase Client Configuration with robust fallback for local preview sandboxes
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY', 'AIzaSyDemoPlaceholderKeyForWebClientAuth'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN', 'personal-gemini-journal.firebaseapp.com'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID', 'personal-gemini-journal'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET', 'personal-gemini-journal.appspot.com'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', '100000000000'),
  appId: getEnv('VITE_FIREBASE_APP_ID', '1:100000000000:web:demoplaceholder')
};

// Initialize Firebase App instance singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
