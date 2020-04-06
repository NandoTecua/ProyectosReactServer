const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json({ errores: errors.array() });
    }

    //extraer email y password
    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email: email });

        if (usuario) {
            return res.status(400).json({ msg: "El usuario ya existe." });
        }

        // guardar nuevo usuario
        usuario = new Usuario(req.body);

        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        await usuario.save();

        // crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
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