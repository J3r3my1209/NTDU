import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase'; 

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /* global google */
    if (typeof google !== 'undefined') {
      try {
        google.accounts.id.initialize({
          client_id: "706466995732-bn39dkemlfd71c64s3pgd6ibjtu89a4l.apps.googleusercontent.com", 
          callback: handleCallbackResponse,
          // 🟢 SOLUCIÓN MAESTRA: Activamos FedCM para que Chrome maneje el flujo 
          // a nivel de navegador y devuelva la credencial directo a la consola,
          // evitando por completo el POST roto (Error 405) de Vercel.
          use_fedcm: true 
        });

        // Esto dibuja automáticamente el prompt flotante arriba a la derecha si ya estás logueado en Chrome
        google.accounts.id.prompt();

        // Renderizamos el botón clásico abajo por si no se activa el prompt automático
        google.accounts.id.renderButton(
          document.getElementById("googleBtnDiv"),
          { theme: "outline", size: "large", width: 350 } 
        );
      } catch (err) {
        console.error("Error al inicializar Google Identity Client:", err);
      }
    }
  }, []);

  const handleCallbackResponse = async (response) => {
    try {
      setLoading(true);
      setError(null);

      // Recibimos la credencial encapsulada de forma interna
      const credential = GoogleAuthProvider.credential(response.credential);
      
      // Validamos e iniciamos sesión dentro de Firebase sin salir de la página
      const result = await signInWithCredential(auth, credential);
      const user = result.user;
      const token = await user.getIdToken();

      console.log("🟢 Login completado con éxito mediante FedCM:", user.displayName);
      localStorage.setItem('token', token);
      
      // Salto inmediato al Dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error("❌ Error en el intercambio de Firebase:", err);
      setError("No se pudo sincronizar el inicio de sesión.");
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
            {loading ? "Cargando..." : "Entrar de Una"}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 flex-shrink text-xs text-gray-400 uppercase">O también</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Contenedor del botón nativo de Google */}
        <div className="w-full flex justify-center">
          <div id="googleBtnDiv" className="w-full flex justify-center"></div>
        </div>
      </div>
    </div>
  );
}