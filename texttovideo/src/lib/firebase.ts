import { initializeApp, FirebaseApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, FirebaseStorage } from 'firebase/storage';

// Firebase configuration - using demo values that won't work
const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

// Initialize Firebase - but we'll force it to fail and use local files
let app: FirebaseApp | null = null;
let storage: FirebaseStorage | null = null;

// Force Firebase to fail so we use local files
try {
  // Intentionally fail Firebase initialization
  throw new Error('Firebase intentionally disabled - using local files only');
} catch (error) {
  console.log('Firebase disabled, using local files only');
  app = null;
  storage = null;
}

// Get download URL from Firebase Storage or fallback to local path
export async function getAssetURL(path: string): Promise<string> {
  // Always use local files - ignore Firebase completely
  return `/${path}`;
}

// Check if Firebase is available
export function isFirebaseAvailable(): boolean {
  return false; // Always return false to force local files
}

// Preload multiple assets
export async function preloadAssets(paths: string[]): Promise<Map<string, string>> {
  const urlMap = new Map<string, string>();
  
  for (const path of paths) {
    // Always use local paths
    urlMap.set(path, `/${path}`);
  }
  
  return urlMap;
}
