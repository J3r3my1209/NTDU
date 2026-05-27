import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 🚀 Importamos las funciones necesarias para la redirección segura
import { 
  signInWithRedirect, 
  getRedirectResult, 
  GoogleAuthProvider 
} from 'firebase/auth';
// Importa tu instancia de 'auth' desde donde tengas configurado Firebase en tu frontend
import { auth } from '../config/firebase.js'; 

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const provider = new GoogleAuthProvider();

  // 🔄 Este useEffect escucha automáticamente cuando el usuario regresa de Google
  useEffect(() => {
    const verificarRetornoGoogle = async () => {
      try {
        setLoading(true);
        const result = await getRedirectResult(auth);
        
        if (result) {
          // El usuario acaba de iniciar sesión con éxito tras ser redirigido
          const user = result.user;
          const token = await user.getIdToken();
          
          console.log("🟢 Login con Google exitoso:", user.displayName);
          
          // Aquí puedes guardar el token en el localStorage o enviarlo a tu backend en Render
          localStorage.setItem('token', token);
          
          // Rediriges al usuario al dashboard o inicio de la app
          navigate('/dashboard'); 
        }
      } catch (err) {
        console.error("❌ Error al procesar el retorno de Google:", err);
        setError("No se pudo completar el inicio de sesión con Google.");
      } finally {
        setLoading(false);
      }
    };

    verificarRetornoGoogle();
  }, [navigate]);

  // 🚪 Función que se ejecuta al presionar el botón
  const handleLoginGoogle = () => {
    try {
      setError(null);
      // Redirige al usuario en la misma pestaña
      signInWithRedirect(auth, provider);
    } catch (err) {
      console.error("❌ Error al iniciar la redirección:", err);
      setError("No se pudo iniciar la autenticación con Google.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        {/* Encabezado */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">
            💵
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Ingresa a tu cuenta
          </h2>
        </div>

        {/* Formulario tradicional (Correo / Contraseña) */}
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

          {/* Mensaje de error dinámico */}
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

        {/* 🔘 BOTÓN DE GOOGLE ACTUALIZADO */}
        <button
          onClick={handleLoginGoogle}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white p-3 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <img 
            src="https://docs.genezio.com/img/google.svg" 
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