import express from 'express';
const router = express.Router();

import { 
    autenticarOSincronizarUsuario, 
    perfil, 
    actualizarPerfil 
} from '../controllers/usuarioController.js';

import checkFirebaseAuth from '../middleware/checkFirebaseAuth.js';

// Todas las rutas de usuario requieren obligatoriamente la verificación del token de Firebase
router.post('/auth-sync', checkFirebaseAuth, autenticarOSincronizarUsuario);
router.get('/perfil', checkFirebaseAuth, perfil);
router.put('/perfil', checkFirebaseAuth, actualizarPerfil);

export default router;