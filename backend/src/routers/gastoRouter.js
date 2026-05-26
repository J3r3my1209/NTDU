import express from 'express';
import { crearGasto, obtenerGastos, actualizarGasto, eliminarGasto } from '../controllers/gastoController.js';
import { exportarAExcel } from '../controllers/reporteController.js'; 
import checkFirebaseAuth from '../middleware/checkFirebaseAuth.js';

const router = express.Router();

router.use(checkFirebaseAuth);

// 📥 Ruta estática prioritaria
router.get('/exportar/excel', exportarAExcel);

// 📋 Rutas base de la API
router.route('/')
    .get(obtenerGastos)
    .post(crearGasto);

// 🆔 Rutas con parámetros dinámicos al final
router.route('/:id')
    .put(actualizarGasto)
    .delete(eliminarGasto);

export default router;