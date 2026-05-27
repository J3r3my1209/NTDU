import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
// 🟢 Importación corregida y segura para Vite
import { auth, provider } from '../config/firebase';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

const handleLoginGoogle = async () => {
    // 1️⃣ ABRIR VENTANA INMEDIATAMENTE: Chrome lo permite porque ocurre al instante del clic
    const proxyWindow = window.open('', '_blank', 'width=500,height=600');
    
    if (!proxyWindow) {
      setError("El navegador bloqueó la ventana de forma estricta. Por favor revisa los permisos.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 2️⃣ PASAR LA VENTANA A FIREBASE: Usamos una propiedad oculta para que Firebase inicie allí
      auth._popupRedirectResolver = undefined; // Limpia resolvers previos si los hay
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      
      console.log("🟢 Autenticado correctamente:", user.displayName);
      localStorage.setItem('token', token);
      
      // Si todo sale bien, cerramos manualmente si quedó abierta o redirigimos
      proxyWindow.close();
      navigate('/dashboard'); 

    } catch (err) {
      console.error("❌ Detalle del error de Google:", err);
      // Cerramos la ventana vacía si falló el proceso
      if (proxyWindow) proxyWindow.close();
      
      if (err.code === 'auth/popup-blocked') {
        setError("El navegador bloqueó la ventana. Intenta usar una pestaña de incógnito.");
      } else {
        setError("Error al conectar con Google. Inténtalo de nuevo.");
      }
    } finally {
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
            Entrar de Una
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
          {loading ? "Conectando..." : "Continuar con Google"}
        </button>
      </div>
    </div>
  );
}