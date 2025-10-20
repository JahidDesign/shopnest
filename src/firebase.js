// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔐 Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsF9jlQdpXdsDz9imvEGKrKy1Px2njyPc",
  authDomain: "shopnest-e9510.firebaseapp.com",
  projectId: "shopnest-e9510",
  storageBucket: "shopnest-e9510.firebasestorage.app",
  messagingSenderId: "533036317045",
  appId: "1:533036317045:web:9ccfca9cdddb6cc78e3b3c",
  measurementId: "G-0446ND6GXP"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// ✅ Initialize analytics only in browser environment
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// ✅ Export all initialized Firebase services
export { auth, db, storage, provider, analytics };
