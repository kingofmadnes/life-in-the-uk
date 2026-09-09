// Firebase bootstrap for the Life in the UK app.
//
// The web config below is NOT a secret — it is meant to ship in the client
// bundle — so pasting your project's values straight into `inlineConfig` is
// fine and is the intended setup here.
//
// If you'd rather keep it out of source control, set the same values in
// `.env.local` as VITE_FIREBASE_* variables (see `.env.local.example`);
// those take precedence over the inline object when present.

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  indexedDBLocalPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import { Capacitor } from "@capacitor/core";

const isNative = Capacitor.isNativePlatform();

const fromEnv = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/* ─────────────  FIREBASE WEB CONFIG  ───────────── */
// Project: life-in-the-uk-de626. These values are public by design.
const inlineConfig = {
  apiKey: "AIzaSyDs3CIeo_u6OY76CLswoVHkZ7Hh0ND_CSE",
  authDomain: "life-in-the-uk-de626.firebaseapp.com",
  projectId: "life-in-the-uk-de626",
  storageBucket: "life-in-the-uk-de626.firebasestorage.app",
  messagingSenderId: "736468936724",
  appId: "1:736468936724:web:33be18085cae9cc5a49f01",
  measurementId: "G-YYD0HFVDEM",
};
/* ───────────────────────────────────────────────── */

const firebaseConfig = fromEnv.apiKey ? fromEnv : inlineConfig;

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId,
);

let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  if (isNative) {
    // In the Capacitor WKWebView, getAuth() sets up a popup/redirect
    // resolver that loads an iframe from the auth domain — that iframe
    // stalls at capacitor://localhost and hangs onAuthStateChanged.
    // initializeAuth() with an explicit persistence list and no resolver
    // skips it. We only use email/password natively, so no resolver is
    // needed. IndexedDB persistence survives WKWebView eviction best.
    auth = initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence],
    });
  } else {
    auth = getAuth(app);
    // Google uses signInWithPopup — web only.
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
  }
}

export { auth, googleProvider };
