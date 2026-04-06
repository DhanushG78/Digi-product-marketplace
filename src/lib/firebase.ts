import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXcWWonA295q-YGKB9szKer6dbJXfBjiM",
  authDomain: "digital-product-marketpl-958ad.firebaseapp.com",
  projectId: "digital-product-marketpl-958ad",
  storageBucket: "digital-product-marketpl-958ad.firebasestorage.app",
  messagingSenderId: "670207004662",
  appId: "1:670207004662:web:dc3d8bd51fd446a55e41d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
