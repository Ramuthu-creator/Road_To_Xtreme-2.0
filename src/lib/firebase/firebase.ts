import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz6Z2lwwIdgTo-2WT8e1FGdfFeW-8kuVE",
  authDomain: "road-to-xtreme-2-0.firebaseapp.com",
  projectId: "road-to-xtreme-2-0",
  storageBucket: "road-to-xtreme-2-0.firebasestorage.app",
  messagingSenderId: "167971376588",
  appId: "1:167971376588:web:824735cfb795cd944e2169",
  measurementId: "G-1N9K6NRDKZ"
};

// Initialize Firebase safely for Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics conditionally
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported: boolean) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics, db };