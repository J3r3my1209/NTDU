import Gasto from '../models/gastos.js';

// 1. Registrar un nuevo gasto
export const crearGasto = async (req, res) => {
    try {
        const { descripcion, monto, categoria } = req.body;

        // req.usuario viene inyectado desde tu middleware de Firebase Auth
        const nuevoGasto = new Gasto({
            descripcion,
            monto,
            categoria,
            usuarioId: req.usuario._id 
        });

        const gastoGuardado = await nuevoGasto.save();
        res.status(201).json(gastoGuardado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2. Obtener los gastos exclusivos del usuario logueado
export const obtenerGastos = async (req, res) => {
    try {
        // Filtramos para que Jeremy solo vea los gastos de Jeremy
        const gastos = await Gasto.find({ usuarioId: req.usuario._id }).sort({ createdAt: -1 });
        res.json(gastos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Actualizar un gasto existente
export const actualizarGasto = async (req, res) => {
    try {
        const { id } = req.params; // Capturamos el ID del gasto desde la URL
        const { descripcion, monto, categoria } = req.body;

        // Buscamos el gasto por su ID
        const gasto = await Gasto.findById(id);

        if (!gasto) {
            return res.status(404).json({ message: 'Gasto no encontrado' });
        }

        // 🔒 SEGURIDAD: Validamos que el gasto le pertenezca al usuario logueado
        if (gasto.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(401).json({ message: 'Acción no autorizada para este usuario' });
        }

        // Actualizamos los campos
        gasto.descripcion = descripcion || gasto.descripcion;
        gasto.monto = monto !== undefined ? monto : gasto.monto;
        gasto.categoria = categoria || gasto.categoria;

        const gastoActualizado = await gasto.save();
        res.json(gastoActualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 4. Eliminar un gasto
export const eliminarGasto = async (req, res) => {
    try {
        const { id } = req.params;

        const gasto = await Gasto.findById(id);

        if (!gasto) {
            return res.status(404).json({ message: 'Gasto no encontrado' });
        }

        // 🔒 SEGURIDAD: Validamos propiedad antes de borrar
        if (gasto.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(401).json({ message: 'Acción no autorizada para este usuario' });
        }

        await gasto.deleteOne();
        res.json({ message: 'Gasto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};