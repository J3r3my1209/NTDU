import admin from '../config/firebase.js';

const checkFirebaseAuth = async (req, res, next) => {
    // 1. Obtener el token del encabezado Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'No autorizado, token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verificar el token directamente con Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token);

        // 3. Firebase guarda el identificador único en decodedToken.uid
        req.user = decodedToken; 

        // Continúa al siguiente controlador de forma segura
        next();
    } catch (error) {
        console.error('Error al verificar el token de Firebase:', error);
        return res.status(403).json({ mensaje: 'Token inválido o expirado' });
    }
};

export default checkFirebaseAuth;