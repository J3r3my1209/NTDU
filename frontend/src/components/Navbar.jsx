import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
// Asegúrate de que la ruta a tu firebase.js sea la correcta según tu carpeta 'config'
import { auth } from '../config/firebase'; 
import { onAuthStateChanged, signOut } from "firebase/auth";

export const Navbar = () => {
  const [user, setUser] = useState(null);

  // Escuchar el estado de la sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Sesión cerrada");
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">💸</span>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">No Tan De Una</h1>
      </Link>
      
      <div className="flex items-center gap-4">
        {user ? (
          // VISTA CUANDO EL USUARIO ESTÁ LOGUEADO
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Hola, {user.displayName || 'Usuario'}</p>
              <button 
                onClick={handleLogout}
                className="text-xs text-red-500 hover:underline"
              >
                Cerrar sesión
              </button>
            </div>
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-[#00E56A]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                👤
              </div>
            )}
          </div>
        ) : (
          // VISTA CUANDO NO HAY SESIÓN (Tu botón original)
          <Link 
            to="/login" 
            className="bg-[#00E56A] hover:bg-[#00c45a] text-black font-semibold py-2 px-6 rounded-full transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};