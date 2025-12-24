
import { initializeApp } from "firebase/app";
// Fix: Import getFirestore from the lite entry point to ensure compatibility in environments where the standard firestore bundle may have export issues.
import { getFirestore } from "firebase/firestore/lite";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAgOhOK-1NdM4RLrq2OQMaC0ZWXAYeEQMI",
  authDomain: "campusresolve-78f86.firebaseapp.com",
  projectId: "campusresolve-78f86",
  storageBucket: "campusresolve-78f86.firebasestorage.app",
  messagingSenderId: "199952240906",
  appId: "1:199952240906:web:7eafddcd9bf859c791aaf3",
  measurementId: "G-TJR9N6MSLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics safely
// Note: Analytics is asynchronous and depends on browser features like indexedDB
export const initAnalytics = async () => {
  try {
    if (await isSupported()) {
      return getAnalytics(app);
    }
  } catch (e) {
    console.warn("Firebase Analytics is not supported in this environment:", e);
  }
  return null;
};

// Trigger background initialization
initAnalytics();
