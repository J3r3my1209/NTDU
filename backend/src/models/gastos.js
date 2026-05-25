import { Schema, model } from 'mongoose';

const gastoSchema = new Schema({
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', // Hace referencia a tu modelo de usuarios
        required: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción del gasto es obligatoria'],
        trim: true
    },
    monto: {
        type: Number,
        required: [true, 'El monto es obligatorio'],
        min: [0, 'El gasto no puede ser negativo']
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        trim: true
    }
}, {
    timestamps: true // Esto añade automáticamente los campos createdAt y updatedAt
});

// Exportamos en singular por convención de Mongoose, apuntando al archivo existente
const Gasto = model('Gasto', gastoSchema);
export default Gasto;