// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-46d4b.firebaseapp.com",
  projectId: "mern-estate-46d4b",
  storageBucket: "mern-estate-46d4b.firebasestorage.app",
  messagingSenderId: "779482647487",
  appId: "1:779482647487:web:180d46bd2eb1b05e6bef0a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);