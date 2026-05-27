import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLKyNzrPBj0jQjD2Fvc8EILqUMhYTBalY",
  authDomain: "ntdu-bcbf2.firebaseapp.com",
  projectId: "ntdu-bcbf2",
  storageBucket: "ntdu-bcbf2.firebasestorage.app",
  messagingSenderId: "706466995732",
  appId: "1:706466995732:web:84cb5f2eee04aac57bd101",
  measurementId: "G-6T9WBT5161"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
export const provider = new GoogleAuthProvider(); 