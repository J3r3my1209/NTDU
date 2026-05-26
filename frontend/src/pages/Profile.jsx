import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const Profile = () => {
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = auth.currentUser;

  // Si el usuario inició sesión con Google, no tiene contraseña que cambiar
  const esProveedorGoogle = user?.providerData?.some(
    (p) => p.providerId === 'google.com'
  );

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError(null);

    if (passwordNueva !== passwordConfirm) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }
    if (passwordNueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (passwordNueva === passwordActual) {
      setError('La nueva contraseña debe ser diferente a la actual.');
      return;
    }

    setLoading(true);
    try {
      // Firebase requiere re-autenticar al usuario antes de cambiar la contraseña
      const credencial = EmailAuthProvider.credential(user.email, passwordActual);
      await reauthenticateWithCredential(user, credencial);

      // Una vez reautenticado, actualizamos la contraseña
      await updatePassword(user, passwordNueva);
      setExito(true);

      // Limpiamos los campos
      setPasswordActual('');
      setPasswordNueva('');
      setPasswordConfirm('');
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('La contraseña actual es incorrecta.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Espera un momento e intenta de nuevo.');
      } else {
        setError('No se pudo actualizar la contraseña. Intenta de nuevo.');
      }
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8F9FA]">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">

        {/* HEADER DE PERFIL */}
        <div className="text-center mb-8">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-4 border-[#00E56A] mx-auto mb-4"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl mx-auto mb-4">
              👤
            </div>
          )}
          <h2 className="text-2xl font-bold">{user.displayName || 'Usuario'}</h2>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>

          {/* Indicador de verificación de email */}
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
            user.emailVerified
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {user.emailVerified ? '✅ Correo verificado' : '⚠️ Correo sin verificar'}
          </span>
        </div>

        {/* SECCIÓN CAMBIO DE CONTRASEÑA */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Cambiar contraseña</h3>

          {esProveedorGoogle ? (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-sm">
                Tu cuenta está vinculada con Google. Para cambiar la contraseña, hazlo desde tu cuenta de Google.
              </p>
            </div>
          ) : (
            <>
              {exito && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm text-center font-medium">
                  ✅ ¡Contraseña actualizada exitosamente!
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña actual
                  </label>
                  <input
                    type="password"
                    placeholder="Ingresa tu contraseña actual"
                    value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00E56A] focus:ring-1 focus:ring-[#00E56A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={passwordNueva}
                    onChange={(e) => setPasswordNueva(e.target.value)}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00E56A] focus:ring-1 focus:ring-[#00E56A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="Repite la nueva contraseña"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00E56A] focus:ring-1 focus:ring-[#00E56A]"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-[#00E56A] font-bold hover:underline">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};
