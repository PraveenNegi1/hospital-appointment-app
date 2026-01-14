// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize or reuse the primary app (used for normal login, admin session, etc.)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Main auth instance – this is what most of your app uses
export const auth = getAuth(app);

// ───────────────────────────────────────────────
// Secondary Firebase app + auth instance
// Used ONLY when admin creates new doctor accounts (prevents signing out admin)
const secondaryAppName = "secondary-from-admin";
let secondaryApp;

if (!getApps().some(a => a.name === secondaryAppName)) {
  secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
} else {
  secondaryApp = getApp(secondaryAppName);
}

export const secondaryAuth = getAuth(secondaryApp);

// ───────────────────────────────────────────────
export const db = getFirestore(app);