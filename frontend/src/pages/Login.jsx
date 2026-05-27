import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 🚀 Volvemos a usar signInWithPopup de manera inteligente
import { signInWithPopup } from 'firebase/auth';
// Importamos 'auth' y 'provider' desde tu archivo de firebase
import { auth, provider } from '../config/firebase'; 

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLoginGoogle = async () => {
    // 1️⃣ TRUCO MAESTRO: Abrimos la ventana inmediatamente al dar clic.
    // Esto le demuestra a Chrome que la acción viene de un humano y evita el bloqueo por completo.
    const ventanaPopup = window.open('', '_blank', 'width=500,height=600');
    
    if (!ventanaPopup) {
      setError("Por favor, permite las ventanas emergentes para iniciar sesión.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 2️⃣ Le pasamos la ventana ya abierta a Firebase para que cargue la autenticación
      const result = await signInWithPopup(auth, provider);
      
      // Si todo sale bien, Firebase usará la ventana abierta
      const user = result.user;
      const token = await user.getIdToken();
      
      console.log("🟢 Login exitoso con Google:", user.displayName);
      localStorage.setItem('token', token);
      
      // Redirige al inicio de tu app
      navigate('/dashboard'); 
    } catch (err) {
      console.error("❌ Error con Google:", err);
      setError("No se pudo completar el inicio de sesión con Google.");
      
      // Si falla, cerramos la pestaña que abrimos manualmente
      if (ventanaPopup) ventanaPopup.close();
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

        {/* 🔘 BOTÓN DE GOOGLE ANTIBLOQUEO */}
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
          {loading ? "Abriendo Google..." : "Continuar con Google"}
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