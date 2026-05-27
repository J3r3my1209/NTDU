import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, provider } from '../config/firebase'; 

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔄 Capturamos el retorno de Google de forma inmediata y persistente
  useEffect(() => {
    let unmounted = false;

    const verificarRetornoDeGoogle = async () => {
      try {
        setLoading(true);
        console.log("🔄 Verificando si vienes regresando de Google...");
        const result = await getRedirectResult(auth);
        
        if (result && !unmounted) {
          const user = result.user;
          const token = await user.getIdToken();
          
          console.log("🟢 ¡Usuario autenticado con éxito!", user.displayName);
          
          // Guardamos con seguridad el token antes de movernos de página
          localStorage.setItem('token', token);
          localStorage.setItem('user_name', user.displayName); 
          
          // Pequeña pausa de 100ms para asegurar la escritura en disco local antes de saltar
          setTimeout(() => {
            navigate('/dashboard');
          }, 100);
        } else {
          console.log("ℹ️ No hay sesión pendiente por procesar en esta carga.");
        }
      } catch (err) {
        console.error("❌ Error crítico al procesar el retorno:", err);
        setError("Error de sincronización con Google. Por favor, intenta de nuevo.");
      } finally {
        if (!unmounted) setLoading(false);
      }
    };

    verificarRetornoDeGoogle();

    return () => {
      unmounted = true;
    };
  }, [navigate]);

  const handleLoginGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      // Redirige en la misma pestaña. ¡Inmune a bloqueadores de popups!
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error("❌ Error al iniciar la redirección:", err);
      setError("No se pudo iniciar la conexión con Google.");
      setLoading(false);
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

          {error && (
            <p className="text-center text-sm font-semibold text-red-500 bg-red-50 p-2 rounded-lg my-2">
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
          {loading ? "Redirigiendo..." : "Continuar con Google"}
        </button>
      </div>
    </div>
  );
}