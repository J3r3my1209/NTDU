import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
    // Firma el token usando el ID del usuario y una clave secreta (.env)
    // Expira en 30 días
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export default generarJWT;