import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

/** Singleton Firebase app — safe to call multiple times */
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/** Firebase Auth instance for the portal */
export const auth = getAuth(app);
