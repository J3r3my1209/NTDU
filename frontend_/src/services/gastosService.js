import axios from 'axios';

const API_URL = 'http://localhost:3001/api/gastos';

// 1. OBTENER GASTOS
export const obtenerGastosAPI = async (token) => {
    const response = await axios.get(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data; // Axios desempaqueta la respuesta automáticamente en .data
};

// 2. CREAR GASTO
export const crearGastoAPI = async (datosFormulario, token) => {
    const response = await axios.post(API_URL, datosFormulario, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

// 3. ACTUALIZAR GASTO (Por si lo necesitas más adelante)
export const actualizarGastoAPI = async (id, gastoData, token) => {
    const response = await axios.put(`${API_URL}/${id}`, gastoData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

// 4. ELIMINAR GASTO
export const eliminarGastoAPI = async (id, token) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

// 5. EXPORTAR REPORTE A EXCEL (.XLSX)
export const exportarAExcelAPI = async (token) => {
    const response = await axios.get(`${API_URL}/exportar/excel`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        responseType: 'blob' // CRÍTICO: Indica a Axios que descargue un archivo binario (.xlsx)
    });
    return response.data; // Retorna el blob directo para que el navegador lo descargue
};