import Gasto from '../models/gastos.js'; // Asegúrate de apuntar bien a tu modelo

// 🔍 1. OBTENER GASTOS
export const obtenerGastos = async (req, res) => {
    try {
        // 🟢 Respaldo de seguridad: si req.user no existe, frena antes de leer el .uid
        if (!req.user || !req.user.uid) {
            return res.status(401).json({ mensaje: 'No se pudo identificar al usuario autenticado' });
        }

        const transacciones = await Gasto.find({ usuarioId: req.user.uid }).sort({ createdAt: -1 });
        res.status(200).json(transacciones);
    } catch (error) {
        console.error('Error al obtener transacciones:', error);
        res.status(500).json({ mensaje: 'Error al cargar el historial' });
    }
};

// 💾 2. CREAR GASTO
export const crearGasto = async (req, res) => {
    try {
        // 🟢 Respaldo de seguridad
        if (!req.user || !req.user.uid) {
            return res.status(401).json({ mensaje: 'No se pudo identificar al usuario autenticado' });
        }

        const { descripcion, monto, tipo, cuenta, categoria } = req.body;

        const nuevoGasto = new Gasto({
            descripcion,
            monto: Number(monto),
            tipo: tipo || 'Gasto',
            cuenta: cuenta || 'Efectivo',
            categoria: categoria || 'Otros',
            usuarioId: req.user.uid
        });

        const gastoGuardado = await nuevoGasto.save();
        res.status(201).json(gastoGuardado);
    } catch (error) {
        console.error('Error al crear la transacción:', error);
        res.status(500).json({ mensaje: 'Error interno al intentar guardar el movimiento' });
    }
};

// ✏️ 3. ACTUALIZAR GASTO
export const actualizarGasto = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizacion = await Gasto.findOneAndUpdate(
            { _id: id, usuarioId: req.user.uid }, 
            req.body,
            { new: true }
        );
        if (!actualizacion) return res.status(404).json({ mensaje: 'Transacción no encontrada' });
        res.status(200).json(actualizacion);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar' });
    }
};

// ❌ 4. ELIMINAR GASTO
export const eliminarGasto = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Gasto.findOneAndDelete({ _id: id, usuarioId: req.user.uid });
        if (!eliminado) return res.status(404).json({ mensaje: 'Transacción no encontrada' });
        res.status(200).json({ mensaje: 'Eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar' });
    }
};