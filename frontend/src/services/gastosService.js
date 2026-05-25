import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_URL = 'http://localhost:3001/api/gastos';

// Función auxiliar para obtener el token de Firebase en tiempo real
const getHeaders = async () => {
    const auth = getAuth();
    const usuarioActual = auth.currentUser;
    if (!usuarioActual) throw new Error("Usuario no autenticado");
    
    const token = await usuarioActual.getIdToken();
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

// 1. Obtener todos los gastos del usuario
export const obtenerGastosAPI = async () => {
    const headers = await getHeaders();
    const response = await axios.get(API_URL, headers);
    return response.data;
};

// 2. Crear un nuevo gasto
export const crearGastoAPI = async (gastoData) => {
    const headers = await getHeaders();
    const response = await axios.post(API_URL, gastoData, headers);
    return response.data;
};

// 3. Actualizar un gasto existente
export const actualizarGastoAPI = async (id, gastoData) => {
    const headers = await getHeaders();
    const response = await axios.put(`${API_URL}/${id}`, gastoData, headers);
    return response.data;
};

// 4. Eliminar un gasto
export const eliminarGastoAPI = async (id) => {
    const headers = await getHeaders();
    const response = await axios.delete(`${API_URL}/${id}`, headers);
    return response.data;
};