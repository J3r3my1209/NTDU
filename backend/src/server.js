import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import conectarDB from './config/db.js';
import usuarioRouter from './routers/usuarioRouter.js';
import gastoRouter from './routers/gastoRouter.js'; // Tu nuevo router
import { readFileSync } from 'fs';

// 1. Configurar variables de entorno y base de datos
dotenv.config();
conectarDB();

// 2. Inicializar Firebase Admin
const firebaseConfig = JSON.parse(readFileSync('./firebase-keys.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig)
});

// 3. ⚠️ CREAR LA APP PRIMERO (Esto soluciona el error)
const app = express();

// 4. Middlewares globales
app.use(cors());
app.use(express.json());

// 5. Definir las rutas (Ahora sí, app existe y no va a crashear)
app.use('/api/usuarios', usuarioRouter);
app.use('/api/gastos', gastoRouter); 

// Ruta base de prueba
app.get('/', (req, res) => {
    res.json({ message: "API de Desarrollo de Aplicaciones Web corriendo", status: "ok" });
});

// 6. Encender el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🟢 Servidor corriendo de forma segura en: http://localhost:${PORT}`);
});