import express from 'express';
// Importamos las nuevas funciones
import { crearGasto, obtenerGastos, actualizarGasto, eliminarGasto } from '../controllers/gastoController.js';
import checkFirebaseAuth from '../middleware/checkFirebaseAuth.js'; 

const router = express.Router();

router.use(checkFirebaseAuth);

// Rutas generales para /api/gastos
router.route('/')
    .get(obtenerGastos)
    .post(crearGasto);

// Rutas específicas que requieren un ID /api/gastos/:id
router.route('/:id')
    .put(actualizarGasto)    // Para editar (PUT)
    .delete(eliminarGasto);  // Para borrar (DELETE)

export default router;