const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json({ errores: errors.array() });
    }

    try {
        // crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);
        proyecto.creador = req.usuario.id;
        proyecto.save();
        res.json({proyecto});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error." });
    }
}

//obtiene todos los proyectos dle usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ registro: -1 });
        res.json({proyectos});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error." });
    }
}

// actualizar los proyectos
exports.actualizarProyecto = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json({ errores: errors.array() });
    }

    // Extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        // revisar el ID
        let proyecto = await Proyecto.exists({ _id: req.params.id });

        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado.' });
        } else {
            proyecto = await Proyecto.findById(req.params.id);
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({ msg: "Usuario no autorizado." });
        }

        // acutalizar
        proyecto =  await Proyecto.findByIdAndUpdate({_id: req.params.id}, 
            { $set: nuevoProyecto }, 
            { new: true } 
        );

        res.json({proyecto});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error." });
    }
}

// Elmina un proyecto por su ID
exports.eliminarProyecto = async (req, res) => {
    try {
        // revisar el ID
        let proyecto = await Proyecto.exists({ _id: req.params.id });

        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado.' });
        } else {
            proyecto = await Proyecto.findById(req.params.id);
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({ msg: "Usuario no autorizado." });
        }

        // eliminar el proyecto
        proyecto =  await Proyecto.findOneAndRemove({ _id: req.params.id});

        res.json({ msg: 'Proyecto eliminado' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error." });
    }
}