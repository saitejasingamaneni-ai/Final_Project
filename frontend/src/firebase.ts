// frontend/src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // For authentication services

// Your Firebase configuration (from a previous chat)
const firebaseConfig = {
  apiKey: "AIzaSyC38eiCskEXxMq7v1_dM19gEupuyvoKK-c",
  authDomain: "supriya-llm.firebaseapp.com",
  databaseURL: "https://supriya-llm-default-rtdb.firebaseio.com",
  projectId: "supriya-llm",
  storageBucket: "supriya-llm.firebasestorage.app",
  messagingSenderId: "1077459080797",
  appId: "1:1077459080797:web:41bfc4a080065068ac9fb4",
  measurementId: "G-RRPS4L7GHP"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the authentication service instance

export { app, auth }; // Export app and auth for use in other components