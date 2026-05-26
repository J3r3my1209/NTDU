import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';

const checkAuth = async (req, res, next) => {
    let token;
    
    // Verificar si el token viene en las cabeceras (Headers) como Bearer Token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Separar la palabra "Bearer" del token real
            token = req.headers.authorization.split(' ')[1];
            
            // Decodificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Buscar el usuario en la BDD por su ID y traerlo sin el password
            req.usuario = await Usuario.findById(decoded.id).select('-password');
            
            return next(); // Continuar al siguiente controlador (ej. perfil)
        } catch (error) {
            const e = new Error('Token no válido o expirado.');
            return res.status(403).json({ msg: e.message });
        }
    }

    if (!token) {
        const error = new Error('Token no proporcionado o inexistente.');
        return res.status(401).json({ msg: error.message });
    }

    next();
};

export default checkAuth;