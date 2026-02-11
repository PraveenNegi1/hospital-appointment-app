import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  setLogLevel
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

/* 🔇 Disable Firestore internal warnings (DEV safe) */
setLogLevel("silent");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/* ───────── Primary App ───────── */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/* ───────── Secondary App (Admin only) ───────── */
const SECONDARY_APP_NAME = "secondary-from-admin";

const secondaryApp =
  getApps().find((a) => a.name === SECONDARY_APP_NAME) ??
  initializeApp(firebaseConfig, SECONDARY_APP_NAME);

export const secondaryAuth = getAuth(secondaryApp);
