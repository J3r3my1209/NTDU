import mongoose from 'mongoose';

const conectarDB = async () => {
    try {
        // Imprimimos la URI para verificar que Node realmente esté leyendo tu clave nueva
        console.log("Intentando conectar a:", process.env.MONGO_URI);
        
        const connection = await mongoose.connect(process.env.MONGO_URI);
        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log(`🟢 MongoDB conectado en: ${url}`);
    } catch (error) {
        console.error(`🔴 Error: ${error.message}`);
        process.exit(1);
    }
};

export default conectarDB;