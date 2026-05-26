import { Schema, model } from 'mongoose';

const transaccionSchema = new Schema({
    // 🟢 CORREGIDO: Cambiado a String para almacenar los UIDs de Firebase de forma persistente
    usuarioId: {
        type: String, 
        required: [true, 'El ID de usuario de Firebase es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },
    monto: {
        type: Number,
        required: [true, 'El monto es obligatorio'],
        min: [0.01, 'El monto debe ser mayor a cero']
    },
    tipo: {
        type: String,
        required: [true, 'El tipo de transacción es obligatorio'],
        enum: ['Ingreso', 'Gasto'] 
    },
    cuenta: {
        type: String,
        required: [true, 'La cuenta financiera es obligatoria'],
        enum: ['Efectivo', 'Banco', 'Tarjeta'] 
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        trim: true 
    }
}, {
    timestamps: true
});

const Gasto = model('Gasto', transaccionSchema);
export default Gasto;