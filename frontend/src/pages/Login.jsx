import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'; 
import { auth, googleProvider } from '../config/firebase'; 

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Función interna para sincronizar el token con Node.js y MongoDB Atlas
  const sincronizarConBackend = async (usuarioFirebase) => {
    // 1. Extraemos el IdToken JWT que generó Firebase
    const token = await usuarioFirebase.getIdToken();

    // 2. Enviamos el token al endpoint del Backend
    const respuesta = await fetch("http://localhost:3001/api/usuarios/auth-sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Formato Bearer Token exigido por el middleware
      }
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.msg || "Error en la sincronización con el servidor");
    }

    // Guardamos el token en el localStorage para mantener la sesión en futuras peticiones
    localStorage.setItem('token_gasto_app', token);
    
    return datos;
  };

  // 1. Función para login tradicional con validaciones locales
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // ── VALIDACIONES DE FRONTEND (Sprint 1) ──
    if ([email, password].includes('')) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      // Autentica en Firebase cliente
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Sincroniza con MongoDB Atlas
      await sincronizarConBackend(userCredential.user);
      
      navigate('/');
    } catch (err) {
      console.error(err.message);
      // Ataja errores tanto de Firebase como del Backend
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError(err.message || 'Error al iniciar sesión.');
      }
    }
  };

  // 2. Función para login con Google
  const handleGoogleLogin = async () => {
    setError(null);
    try {
      // Autentica con popup de Google
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      // Sincroniza con MongoDB Atlas de manera transparente
      await sincronizarConBackend(userCredential.user);
      
      navigate('/');
    } catch (err) {
      console.error("Error con Google:", err.message);
      setError('No se pudo iniciar sesión con Google.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8F9FA]">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <span className="text-4xl">💸</span>
          <h2 className="text-2xl font-bold mt-4">Ingresa a tu cuenta</h2>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00E56A] focus:ring-1 focus:ring-[#00E56A]"
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00E56A] focus:ring-1 focus:ring-[#00E56A]"
          />

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button 
            type="submit" 
            className="w-full mt-2 bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Entrar de Una
          </button>
        </form>

        {/* SEPARADOR ORIENTAL */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">O también</span></div>
        </div>

        {/* BOTÓN DE GOOGLE */}
        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-5 h-5"
          />
          Continuar con Google
        </button>

        <p className="text-center mt-6 text-sm text-gray-600">
          ¿No tienes cuenta? <Link to="/register" className="text-[#00E56A] font-bold hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};