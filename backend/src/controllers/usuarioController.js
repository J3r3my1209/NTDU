import Usuario from '../models/usuario.js';

// 1. Sincronizar Autenticación / Registro Automático
// Reemplaza a 'registrar' y 'autenticar' tradicionales porque Firebase ya valida las credenciales.
const autenticarOSincronizarUsuario = async (req, res) => {
    try {
        res.status(200).json({
            msg: "Usuario autenticado y sincronizado con éxito en MongoDB Atlas",
            usuario: req.usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al procesar el usuario en el backend." });
    }
};

// 2. Ver Perfil (Requerimiento del Sprint 1)
const perfil = async (req, res) => {
    if (!req.usuario) {
        return res.status(404).json({ msg: "Usuario no encontrado." });
    }
    res.json(req.usuario);
};

// 3. Actualizar Perfil (Requerimiento del Sprint 1)
const actualizarPerfil = async (req, res) => {
    const { nombre, email } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({ msg: "Todos los campos (nombre y email) son obligatorios." });
    }
    // Validación de formato de email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: "El formato del correo electrónico no es válido." });
    }

    try {
        // Buscamos al usuario que está realizando la petición
        const usuario = await Usuario.findById(req.usuario._id);
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado." });
        }

        // Validar si intenta cambiar el email a uno que ya pertenece a otro usuario
        if (email !== usuario.email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({ msg: "Ese correo electrónico ya está registrado por otro usuario." });
            }
        }

        // Asignar los nuevos valores en MongoDB Atlas
        usuario.nombre = nombre;
        usuario.email = email;

        const usuarioActualizado = await usuario.save();
        res.json({
            msg: "Perfil actualizado correctamente en la BDD",
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al actualizar el perfil." });
    }
};

export {
    autenticarOSincronizarUsuario,
    perfil,
    actualizarPerfil
};