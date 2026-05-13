import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Importamos updateProfile
import { auth } from '../config/firebase';

export const Register = () => {
  const [nombre, setNombre] = useState(''); // Estado para el nombre
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // 1. Creamos la cuenta
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Guardamos el nombre en el perfil de Firebase
      await updateProfile(userCredential.user, {
        displayName: nombre
      });

      // 3. Ahora sí, navegamos al inicio
      navigate('/'); 
    } catch (err) {
      setError('Hubo un error al registrarse. Revisa tus datos.');
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8F9FA]">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <span className="text-4xl">💸</span>
          <h2 className="text-2xl font-bold mt-4">Crea tu cuenta</h2>
          <p className="text-gray-500 mt-2">Empieza a controlar tus gastos hoy</p>
        </div>
        
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {/* NUEVO INPUT PARA EL NOMBRE */}
          <input 
            type="text" 
            placeholder="¿Cómo te llamas?" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00E56A] focus:ring-1 focus:ring-[#00E56A]"
          />

          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00E56A] focus:ring-1 focus:ring-[#00E56A]"
          />
          <input 
            type="password" 
            placeholder="Contraseña (mínimo 6 caracteres)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00E56A] focus:ring-1 focus:ring-[#00E56A]"
          />
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            className="w-full mt-2 bg-[#00E56A] text-black font-semibold py-3 rounded-lg hover:bg-[#00c45a] transition-colors"
          >
            Registrarse de Una
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          ¿Ya tienes cuenta? <Link to="/login" className="text-black font-bold hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};