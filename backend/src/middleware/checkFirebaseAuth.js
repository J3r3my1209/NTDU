import admin from 'firebase-admin'; 
import Usuario from '../models/usuario.js'; // Importamos tu modelo de MongoDB

const checkFirebaseAuth = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Firebase verifica si el token es válido y real
            const decodedToken = await admin.auth().verifyIdToken(token);
            
            // 💡 EL CAMBIO AQUÍ: Buscamos en MongoDB Atlas usando el firebaseId decodificado
            let usuario = await Usuario.findOne({ firebaseId: decodedToken.uid });
            
            // Si el usuario se logueó en Firebase pero por alguna razón no está en Mongo, lo registramos automáticamente
            if (!usuario) {
                usuario = new Usuario({
                    firebaseId: decodedToken.uid,
                    nombre: decodedToken.name || 'Usuario de Google',
                    email: decodedToken.email
                });
                await usuario.save();
            }

            // Guardamos el usuario de la Base de Datos en el Request para que los controladores lo usen
            req.usuario = usuario; 
            
            return next();
        } catch (error) {
            console.error(error);
            return res.status(403).json({ msg: 'Token de autenticación no válido o expirado' });
        }
    }
    
    if (!token) {
        return res.status(401).json({ msg: 'No se proporcionó un token de acceso' });
    }
};

export default checkFirebaseAuth;