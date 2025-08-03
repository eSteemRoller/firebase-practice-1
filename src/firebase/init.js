
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9Hz9Nc-yNcKWPWkQBW3ANTSb2YiBCMYY",
  authDomain: "fir-practice-ff06c.firebaseapp.com",
  projectId: "fir-practice-ff06c",
  storageBucket: "fir-practice-ff06c.firebasestorage.app",
  messagingSenderId: "920010186718",
  appId: "1:920010186718:web:b0cb237f19ddbc693a474f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();

