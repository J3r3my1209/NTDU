import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 🚀 Importamos los métodos para redirección nativa
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
// Importamos 'auth' y 'provider' de tu archivo de configuración
import { auth, provider } from '../config/firebase.js'; 

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔄 Este useEffect detecta automáticamente cuando el usuario vuelve de Google
  useEffect(() => {
    const comprobarRetornoDeGoogle = async () => {
      try {
        setLoading(true);
        const result = await getRedirectResult(auth);
        
        if (result) {
          // ¡Login exitoso tras la redirección!
          const user = result.user;
          const token = await user.getIdToken();
          
          console.log("🟢 Login con Google exitoso:", user.displayName);
          localStorage.setItem('token', token);
          
          // Te manda a tu pantalla principal
          navigate('/dashboard'); 
        }
      } catch (err) {
        console.error("❌ Error al procesar el retorno de Google:", err);
        setError("Ocurrió un error al regresar de la autenticación.");
      } finally {
        setLoading(false);
      }
    };

    comprobarRetornoDeGoogle();
  }, [navigate]);

  // 🚪 Función del botón
  const handleLoginGoogle = () => {
    try {
      setError(null);
      // Redirige en la misma pestaña. ¡Inmune a los bloqueadores de pop-ups!
      signInWithRedirect(auth, provider);
    } catch (err) {
      console.error("❌ Error al iniciar redirección:", err);
      setError("No se pudo conectar con Google.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">
            💵
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Ingresa a tu cuenta
          </h2>
        </div>

        <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-gray-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {error && (
            <p className="text-center text-sm font-semibold text-red-500 animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-black p-3 font-semibold text-white transition hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Entrar de Una"}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 flex-shrink text-xs text-gray-400 uppercase">O también</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleLoginGoogle}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white p-3 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="h-5 w-5" 
          />
          {loading ? "Procesando..." : "Continuar con Google"}
        </button>

        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <span className="cursor-pointer font-bold text-emerald-500 hover:underline" onClick={() => navigate('/registro')}>
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
}