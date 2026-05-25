import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from './config/firebase'; // Asegúrate de que esta ruta apunte bien a tu firebase.js
import { onAuthStateChanged } from 'firebase/auth';

// Importamos tus componentes y páginas reales
import { Navbar } from './components/Navbar'; // Tu Navbar real con llaves
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import GastosDashboard from './components/GastosDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Escuchamos la sesión globalmente en App para saber si mostrar el Dashboard o no
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Cargando aplicación...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🟢 Tu Navbar interactivo real (Maneja sesión, foto de perfil y logout) */}
      <Navbar />

      {/* Control del enrutamiento de tus páginas principales */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <>
            {/* Mensaje estético de bienvenida en la página de inicio */}
            <div className="text-center my-12 px-4">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Controla tus gastos, <span className="text-emerald-500">sin tantas vueltas.</span>
              </h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Bienvenido a No Tan de Una. La herramienta perfecta para saber a dónde se te está yendo la plata cada fin de mes.
              </p>
            </div>

            {/* 🚀 Si el usuario inició sesión de verdad, le mostramos el panel interactivo */}
            {user ? (
              <div className="pb-12">
                <GastosDashboard />
              </div>
            ) : (
              <div className="text-center mt-6">
                <p className="text-gray-500">Inicia sesión para empezar a registrar tus gastos.</p>
              </div>
            )}
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;