import React, { useState, useEffect } from 'react';
import { obtenerGastosAPI, crearGastoAPI, eliminarGastoAPI } from '../services/gastosService';

const GastosDashboard = () => {
    // Estados para la lista de gastos y el formulario
    const [gastos, setGastos] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [categoria, setCategoria] = useState('Comida');
    const [loading, setLoading] = useState(true);

    // Cargar los gastos de la base de datos al montar el componente
    useEffect(() => {
        cargarGastos();
    }, []);

    const cargarGastos = async () => {
        try {
            const data = await obtenerGastosAPI();
            setGastos(data);
        } catch (error) {
            console.error("Error al traer los gastos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Manejar el envío del nuevo gasto
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!descripcion || !monto) return alert("Por favor, llena todos los campos");

        try {
            const nuevoGasto = {
                descripcion,
                monto: Number(monto),
                categoria
            };
            
            await crearGastoAPI(nuevoGasto);
            
            // Limpiar formulario y recargar lista
            setDescripcion('');
            setMonto('');
            cargarGastos();
        } catch (error) {
            console.error("Error al crear el gasto:", error);
        }
    };

    // Manejar la eliminación de un gasto
    const handleEliminar = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas borrar este gasto?")) {
            try {
                await eliminarGastoAPI(id);
                cargarGastos(); // Recargar lista
            } catch (error) {
                console.error("Error al eliminar el gasto:", error);
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">📈 Panel de Control de Gastos</h1>

            {/* Formulario de Registro */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">💰 Registrar Nuevo Gasto</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Descripción</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ej. Almuerzo, Gasolina..."
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Monto ($)</label>
                        <input 
                            type="number" 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="0.00"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Categoría</label>
                        <select 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                        >
                            <option value="Comida">🍴 Comida</option>
                            <option value="Transporte">🚗 Transporte</option>
                            <option value="Entretenimiento">🎬 Entretenimiento</option>
                            <option value="Servicios">💡 Servicios</option>
                            <option value="Otros">📦 Otros</option>
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded-lg transition duration-200 shadow"
                    >
                        + Añadir Gasto
                    </button>
                </form>
            </div>

            {/* Historial de Gastos */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">📋 Historial de Transacciones</h2>
                
                {loading ? (
                    <p className="text-center text-gray-500">Cargando transacciones...</p>
                ) : gastos.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No hay gastos registrados aún. ¡Empieza a ahorrar!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                                    <th className="p-3">Descripción</th>
                                    <th className="p-3">Categoría</th>
                                    <th className="p-3">Monto</th>
                                    <th className="p-3">Fecha</th>
                                    <th className="p-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-gray-600 text-sm">
                                {gastos.map((g) => (
                                    <tr key={g._id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="p-3 font-medium text-gray-800">{g.descripcion}</td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700">
                                                {g.categoria}
                                            </span>
                                        </td>
                                        <td className="p-3 font-semibold text-red-600">-${g.monto.toFixed(2)}</td>
                                        <td className="p-3">{new Date(g.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3 text-center">
                                            <button 
                                                onClick={() => handleEliminar(g._id)}
                                                className="bg-red-100 hover:bg-red-200 text-red-600 p-1.5 rounded-lg transition duration-150"
                                                title="Eliminar Gasto"
                                            >
                                                🗑️ Borrar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GastosDashboard;