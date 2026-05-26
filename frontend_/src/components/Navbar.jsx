import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                Hola, {user.displayName || 'Usuario'}
              </p>
              <div className="flex gap-3 justify-end">
                <Link
                  to="/profile"
                  className="text-xs text-[#00E56A] hover:underline"
                >
                  Mi perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-500 hover:underline"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
            <Link to="/profile">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-[#00E56A] hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer">
                  👤
                </div>
              )}
            </Link>
          </div>
        ) : (
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
