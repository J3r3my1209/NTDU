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
      google.accounts.id.initialize({
        client_id: "706466995732-bn39dkemlfd71c64s3pgd6ibjtu89a4l.apps.googleusercontent.com", 
        callback: handleCallbackResponse,
        // 🚀 CAMBIO ESTRATÉGICO: Forzamos la redirección nativa en la misma pestaña
        ux_mode: "redirect", 
        login_uri: "https://ntdu.vercel.app/login"
      });

      google.accounts.id.renderButton(
        document.getElementById("googleBtnDiv"),
        { theme: "outline", size: "large", width: 350 } 
      );
    }
  }, []);

const handleCallbackResponse = async (response) => {
    try {
      setLoading(true);
      setError(null);

      // Extraemos la credencial segura devuelta por la redirección de Google
      const credential = GoogleAuthProvider.credential(response.credential);
      
      // Iniciamos sesión en Firebase usando el token verificado
      const result = await signInWithCredential(auth, credential);
      const user = result.user;
      const token = await user.getIdToken();

      console.log("🟢 Autenticación exitosa:", user.displayName);
      localStorage.setItem('token', token);
      
      // Redirección inmediata al Dashboard sin esperas catastróficas
      navigate('/dashboard');
    } catch (err) {
      console.error("❌ Error en canje de credencial:", err);
      setError("Error de sincronización con Google Identity.");
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

        {/* 🔘 NUEVO CONTENEDOR SEGURO PARA EL BOTÓN OFICIAL DE GOOGLE */}
        <div className="w-full flex justify-center">
          <div id="googleBtnDiv" className="w-full"></div>
        </div>
      </div>
    </div>
  );
}