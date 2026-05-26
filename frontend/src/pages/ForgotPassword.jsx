import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setEnviado(true);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No hay ninguna cuenta registrada con ese correo.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El correo ingresado no es válido.');
      } else {
        setError('Ocurrió un error. Intenta de nuevo.');
      }
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8F9FA]">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
          <span className="text-5xl">🔑</span>
          <h2 className="text-2xl font-bold mt-4 mb-2">¡Correo enviado!</h2>
          <p className="text-gray-600 mb-2">
            Te mandamos las instrucciones para restablecer tu contraseña a:
          </p>
          <p className="font-semibold text-gray-900 mb-6">{email}</p>
          <p className="text-sm text-gray-500 mb-8">
            Revisa tu bandeja de entrada (y el spam, por si las moscas 😅).
          </p>
          <Link
            to="/login"
            className="block w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8F9FA]">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <span className="text-4xl">🔐</span>
          <h2 className="text-2xl font-bold mt-4">¿Olvidaste tu contraseña?</h2>
          <p className="text-gray-500 mt-2">
            Ingresa tu correo y te enviamos un link para restablecerla.
          </p>
        </div>

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00E56A] focus:ring-1 focus:ring-[#00E56A]"
          />

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Enviar link de recuperación'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          <Link to="/login" className="text-[#00E56A] font-bold hover:underline">
            ← Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
};
