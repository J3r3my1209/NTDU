import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const sincronizarConBackend = async (usuarioFirebase) => {
    const token = await usuarioFirebase.getIdToken();
    const respuesta = await fetch("http://localhost:3001/api/usuarios/auth-sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) {
      throw new Error(datos.msg || "Error en la sincronización con el servidor");
    }
    localStorage.setItem('token_gasto_app', token);
    return datos;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if ([email, password].includes('')) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await sincronizarConBackend(userCredential.user);
      navigate('/');
    } catch (err) {
      console.error(err.message);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError(err.message || 'Error al iniciar sesión.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
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

          {/* LINK DE RECUPERACIÓN DE CONTRASEÑA */}
          <div className="text-right -mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-500 hover:text-[#00E56A] hover:underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full mt-2 bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Entrar de Una
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">O también</span>
          </div>
        </div>

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
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-[#00E56A] font-bold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};
