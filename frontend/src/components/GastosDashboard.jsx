import React, { useState, useEffect } from 'react';
// 🛠️ RUTA DE FIREBASE CORREGIDA QUE TE FUNCIONÓ
import { auth } from "../config/firebase.js"; 
// Importamos los servicios de la API
import { obtenerGastosAPI, crearGastoAPI, eliminarGastoAPI, exportarAExcelAPI } from '../services/gastosService';

// 📊 Diccionario estático de categorías separadas de forma lógica
const categoriasPorTipo = {
    Gasto: ['Comida', 'Vivienda', 'Transporte', 'Estudios', 'Otros'],
    Ingreso: ['Sueldo', 'Inversiones', 'Negocio', 'Premios', 'Otros']
};

const GastosDashboard = () => {
    // --- ESTADOS ---
    const [gastos, setGastos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estado para el formulario de registro
    const [form, setForm] = useState({
        descripcion: '',
        monto: '',
        tipo: 'Gasto',
        cuenta: 'Efectivo',
        categoria: 'Comida'
    });

    // --- CARGAR DATOS AL INICIAR ---
    useEffect(() => {
        const cargarTransacciones = async () => {
            try {
                auth.onAuthStateChanged(async (user) => {
                    if (user) {
                        const token = await user.getIdToken();
                        const data = await obtenerGastosAPI(token);
                        setGastos(data || []);
                    }
                    setLoading(false);
                });
            } catch (error) {
                console.error("Error al cargar las transacciones:", error);
                setLoading(false);
            }
        };
        cargarTransacciones();
    }, []);

    // --- 🛠️ CÁLCULOS DE LOS TOTALES SEGUROS ---
    const listaGastos = Array.isArray(gastos) 
        ? gastos 
        : (gastos && Array.isArray(gastos.gastos) ? gastos.gastos : []);

    const totalIngresos = listaGastos
        .filter(t => t && t.tipo === 'Ingreso')
        .reduce((acc, curr) => acc + Number(curr.monto || 0), 0);

    const totalGastos = listaGastos
        .filter(t => t && t.tipo === 'Gasto')
        .reduce((acc, curr) => acc + Number(curr.monto || 0), 0);

    const saldoDisponible = totalIngresos - totalGastos;

    // --- MANEJO DEL FORMULARIO INTELIGENTE ---
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'tipo') {
            // 🧠 SI EL USUARIO CAMBIA EL TIPO, CAMBIAMOS LA CATEGORÍA POR DEFECTO AUTOMÁTICAMENTE
            setForm({
                ...form,
                tipo: value,
                categoria: value === 'Ingreso' ? 'Sueldo' : 'Comida'
            });
        } else {
            // Comportamiento normal para el resto de campos
            setForm({
                ...form,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.descripcion || !form.monto) {
            alert("Por favor, llena los campos obligatorios (Descripción y Monto)");
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) return alert("Sesión inválida");
            const token = await user.getIdToken();

            const nuevoGasto = await crearGastoAPI(form, token);
            
            const operacionCreada = nuevoGasto?.gasto || nuevoGasto?.transaccion || nuevoGasto;
            
            setGastos([operacionCreada, ...listaGastos]);
            
            setForm({
                descripcion: '',
                monto: '',
                tipo: 'Gasto',
                cuenta: 'Efectivo',
                categoria: 'Comida'
            });
        } catch (error) {
            console.error("Error al registrar la operación:", error);
            alert("No se pudo guardar la transacción");
        }
    };

    // --- ELIMINAR TRANSACCIÓN ---
    const handleEliminar = async (id) => {
        if (!confirm("¿Estás seguro de eliminar esta transacción?")) return;

        try {
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();

            await eliminarGastoAPI(id, token);
            setGastos(listaGastos.filter(g => g._id !== id));
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("No se pudo eliminar la transacción");
        }
    };

    // --- EXPORTAR A EXCEL REAL .XLSX ---
    const descargarExcelOficial = async () => {
        if (listaGastos.length === 0) {
            alert("No hay transacciones registradas para exportar.");
            return;
        }

        try {
            const user = auth.currentUser; 
            if (!user) {
                alert("Sesión expirada. Por favor, vuelve a iniciar sesión.");
                return;
            }
            
            const token = await user.getIdToken();
            const blob = await exportarAExcelAPI(token);
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Reporte_NoTanDeUna_${new Date().toLocaleDateString('es-EC').replace(/\//g, '-')}.xlsx`;
            document.body.appendChild(a);
            a.click();
            
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error al exportar a Excel:", error);
            alert("Ocurrió un error al compilar tu reporte de Excel (.xlsx)");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-600 font-medium animate-pulse">Cargando tu panel financiero...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                
                {/* 💰 TARJETAS DE TOTALES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
                        <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">💰 Saldo Total Disponible</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-2">
                            ${saldoDisponible.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
                        <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">📈 Total Ingresos</p>
                        <h3 className="text-3xl font-black text-emerald-600 mt-2">
                            +${totalIngresos.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
                        <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">📉 Total Gastos</p>
                        <h3 className="text-3xl font-black text-red-600 mt-2">
                            -${totalGastos.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                    </div>
                </div>

                {/* FORMULARIO Y ANÁLISIS DE GASTOS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm lg:col-span-2">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">✨ Registrar Operación</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
                                    <input 
                                        type="text" 
                                        name="descripcion"
                                        value={form.descripcion}
                                        onChange={handleChange}
                                        placeholder="Ej. Sueldo, Supermercado..." 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Monto ($)</label>
                                    <input 
                                        type="number" 
                                        name="monto"
                                        step="0.01"
                                        value={form.monto}
                                        onChange={handleChange}
                                        placeholder="0.00" 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo</label>
                                    <select 
                                        name='tipo'
                                        value={form.tipo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="Gasto">📉 Gasto</option>
                                        <option value="Ingreso">📈 Ingreso</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cuenta</label>
                                    <select 
                                        name="cuenta"
                                        value={form.cuenta}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="Efectivo">💵 Efectivo</option>
                                        <option value="Banco">🏦 Banco</option>
                                        <option value="Tarjeta">💳 Tarjeta</option>
                                    </select>
                                </div>
                            </div>

                            {/* 🔄 SELECT DE CATEGORÍAS TOTALMENTE DINÁMICO */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoría</label>
                                <select 
                                    name="categoria"
                                    value={form.categoria}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    {categoriasPorTipo[form.tipo].map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat === 'Sueldo' && '💵 '}
                                            {cat === 'Inversiones' && '📈 '}
                                            {cat === 'Negocio' && '💼 '}
                                            {cat === 'Premios' && '🎁 '}
                                            {cat === 'Comida' && '🍴 '}
                                            {cat === 'Vivienda' && '🏠 '}
                                            {cat === 'Transporte' && '🚗 '}
                                            {cat === 'Estudios' && '📚 '}
                                            {cat === 'Otros' && '📦 '}
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition duration-200 shadow-sm mt-2"
                            >
                                + Guardar Transacción
                            </button>
                        </form>
                    </div>

                    {/* Análisis de Gastos */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">📊 Análisis de Gastos</h2>
                            <p className="text-xs text-gray-400">¿En qué se te está yendo más el dinero?</p>
                        </div>
                        
                        <div className="my-auto py-8 text-center">
                            {listaGastos.length === 0 ? (
                                <p className="text-xs text-gray-400 italic">Registra gastos para ver el análisis de distribución.</p>
                            ) : (
                                <div className="space-y-3 text-left">
                                    <p className="text-xs font-bold text-gray-600">Último movimiento:</p>
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <p className="text-sm font-semibold text-gray-700">{listaGastos[0]?.descripcion}</p>
                                        <p className="text-xs text-gray-400">{listaGastos[0]?.categoria} • {listaGastos[0]?.cuenta}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="text-[10px] text-gray-400 text-center bg-gray-50 py-2 rounded-xl">
                            Filtrado automático por cuenta de usuario activo
                        </div>
                    </div>
                </div>

                {/* SECCIÓN DE HISTORIAL Y BOTÓN DE EXCEL */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">📋 Historial de Transacciones</h2>
                            <p className="text-xs text-gray-400">Lista completa de tus movimientos financieros</p>
                        </div>
                        
                        <button
                            onClick={descargarExcelOficial}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Descargar Reporte (Excel .XLSX)
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        {listaGastos.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-sm text-gray-400 italic">No hay transacciones registradas aún. ¡Empieza agregando una arriba!</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                                        <th className="pb-3 pl-2">Descripción</th>
                                        <th className="pb-3">Categoría</th>
                                        <th className="pb-3">Cuenta</th>
                                        <th className="pb-3">Monto</th>
                                        <th className="pb-3">Fecha</th>
                                        <th className="pb-3 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-sm">
                                    {listaGastos.map((g) => (
                                        <tr key={g._id || Math.random()} className="hover:bg-gray-50/70 transition-colors">
                                            <td className="py-3.5 font-medium text-gray-800 pl-2">{g.descripcion}</td>
                                            <td className="py-3.5 text-gray-500">
                                                <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
                                                    {g.categoria}
                                                </span>
                                            </td>
                                            <td className="py-3.5 text-gray-500 text-xs font-semibold">{g.cuenta}</td>
                                            <td className={`py-3.5 font-bold ${g.tipo === 'Gasto' ? 'text-red-500' : 'text-emerald-500'}`}>
                                                {g.tipo === 'Gasto' ? '-' : '+'}${Number(g.monto || 0).toFixed(2)}
                                            </td>
                                            <td className="py-3.5 text-gray-400 text-xs">
                                                {new Date(g.createdAt || g.fecha || Date.now()).toLocaleDateString('es-EC')}
                                            </td>
                                            <td className="py-3.5 text-center">
                                                <button 
                                                    onClick={() => handleEliminar(g._id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                                                >
                                                    ❌
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GastosDashboard;