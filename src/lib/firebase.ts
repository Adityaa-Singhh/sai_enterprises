/**
 * Firebase Initialization — Sai Enterprises
 *
 * This is the single source of truth for all Firebase service instances.
 * Import services from here, never initialize Firebase elsewhere.
 *
 * Config is read from environment variables (VITE_FIREBASE_*).
 * Never hardcode credentials directly in this file.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore';
import {
  getStorage,
  connectStorageEmulator,
  type FirebaseStorage,
} from 'firebase/storage';

// ---------------------------------------------------------------------------
// Configuration — values sourced from .env.local (never committed to Git)
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate that all required env variables are present
const requiredKeys: (keyof typeof firebaseConfig)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

for (const key of requiredKeys) {
  if (!firebaseConfig[key]) {
    throw new Error(
      `[Firebase] Missing required environment variable: VITE_FIREBASE_${key.toUpperCase()}. ` +
        `Check your .env.local file.`
    );
  }
}

// ---------------------------------------------------------------------------
// Initialize Firebase App (singleton — safe for HMR)
// ---------------------------------------------------------------------------
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// ---------------------------------------------------------------------------
// Service Instances
// ---------------------------------------------------------------------------
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// ---------------------------------------------------------------------------
// Emulator Support (local development only)
// Connect to local Firebase Emulators when VITE_USE_FIREBASE_EMULATOR=true
// ---------------------------------------------------------------------------
const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

if (useEmulator) {
  // Only connect if not already connected (HMR safety)
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: false });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.info('[Firebase] ✅ Connected to local Emulators (Auth:9099, Firestore:8080, Storage:9199)');
  } catch {
    // Already connected (hot reload) — safe to ignore
  }
} else if (import.meta.env.DEV) {
  console.info(`[Firebase] 🔗 Connected to project: ${firebaseConfig.projectId}`);
}

export { app };
export default app;
