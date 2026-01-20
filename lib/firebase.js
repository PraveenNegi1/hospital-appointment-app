import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ← ADD THIS

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize or reuse the primary app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Main auth
export const auth = getAuth(app);

// Secondary app + auth (for admin creating doctors)
const secondaryAppName = "secondary-from-admin";
let secondaryApp;

if (!getApps().some((a) => a.name === secondaryAppName)) {
  secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
} else {
  secondaryApp = getApp(secondaryAppName);
}

export const secondaryAuth = getAuth(secondaryApp);

// Firestore
export const db = getFirestore(app);

// ───────────────────────────────────────────────
// ADD THESE TWO LINES
export const storage = getStorage(app); // ← main storage instance (most common choice)
// export const secondaryStorage = getStorage(secondaryApp);  // optional - only if needed
