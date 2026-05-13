// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLKyNzrPBj0jQjD2Fvc8EILqUMhYTBalY",
  authDomain: "ntdu-bcbf2.firebaseapp.com",
  projectId: "ntdu-bcbf2",
  storageBucket: "ntdu-bcbf2.firebasestorage.app",
  messagingSenderId: "706466995732",
  appId: "1:706466995732:web:84cb5f2eee04aac57bd101",
  measurementId: "G-6T9WBT5161"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); 
export const googleProvider = new GoogleAuthProvider();