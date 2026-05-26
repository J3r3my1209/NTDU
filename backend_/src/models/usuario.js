import { Schema, model } from 'mongoose';

const usuarioSchema = new Schema({
    firebaseId: {
        type: String,
        required: true,
        unique: true, // Aquí se guarda el UID único que genera Firebase
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    }
}, {
    timestamps: true // Esto crea automáticamente createdAt y updatedAt en la base de datos
});

export default model('Usuario', usuarioSchema);