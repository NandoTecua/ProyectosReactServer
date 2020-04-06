const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json({ errores: errors.array() });
    }

    //extraer email y password
    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email: email });

        if (!usuario) {
            return res.status(400).json({ msg: "El usuario no existe." });
        }

        // revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: "El password es incorrecto." });
        }

        // crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre
            }
        };

        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 36000
        }, (error, token) => {
            if (error) throw error;

            // Mensaje de confirmacion
            res.json({ token });
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error." });
    }
}

exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({ usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error." });
    }
}