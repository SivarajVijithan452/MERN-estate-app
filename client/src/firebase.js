// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-esate-app.firebaseapp.com",
  projectId: "mern-esate-app",
  storageBucket: "mern-esate-app.firebasestorage.app",
  messagingSenderId: "226686321440",
  appId: "1:226686321440:web:660fd17ba91aa297fbcd45"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);