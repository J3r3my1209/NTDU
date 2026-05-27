import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLKyNzrPBj0jQjD2Fvc8EILqUMhYTBalY",
  // 🟢 CAMBIO CLAVE: Cambiamos el authDomain para saltarnos el hosting roto de Firebase
  // Al apuntar directamente a tu dominio verificado de Vercel, Firebase redirige de forma nativa ahí.
  authDomain: "ntdu.vercel.app", 
  projectId: "ntdu-bcbf2",
  storageBucket: "ntdu-bcbf2.firebasestorage.app",
  messagingSenderId: "706466995732",
  appId: "1:706466995732:web:84cb5f2eee04aac57bd101",
  measurementId: "G-6T9WBT5161"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar las instancias listas para usar
export const auth = getAuth(app); 
export const provider = new GoogleAuthProvider();

// Configuración extra para forzar la selección de cuenta limpia
provider.setCustomParameters({
  prompt: 'select_account'
});