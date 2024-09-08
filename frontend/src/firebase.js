// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-c9b88.firebaseapp.com",
  projectId: "mern-blog-c9b88",
  storageBucket: "mern-blog-c9b88.appspot.com",
  messagingSenderId: "1060110540678",
  appId: "1:1060110540678:web:1c6f977ca59ee5d3b01607",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
