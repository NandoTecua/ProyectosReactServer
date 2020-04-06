const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearTarea = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json({ errores: errors.array() });
    }

    try {
        // revisar el proyectoId
        let proyecto = await Proyecto.exists({ _id: req.body.proyectoId.toString() });

        if (!proyecto) {
            return res.status(404).json({ msg: 'El proyecto no encontrado.' });
        } else {
            proyecto = await Proyecto.findById(req.body.proyectoId);
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({ msg: "Usuario no autorizado." });
        }

        // crear una nueva tarea
        const tarea = new Tarea(req.body);
        tarea.save();
        res.json({tarea});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error." });
    }
}

// obtener las tareas de un proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        // revisar el proyectoId
        let proyecto = await Proyecto.exists({ _id: req.query.proyectoId.toString() });

        if (!proyecto) {
            return res.status(404).json({ msg: 'El proyecto no encontrado.' });
        } else {
            proyecto = await Proyecto.findById(req.query.proyectoId);
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({ msg: "Usuario no autorizado." });
        }

        // crear una nueva tarea
        const tareas = await Tarea.find({ proyectoId: req.query.proyectoId }).sort({ creado: -1 });
        res.json({ tareas });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error." });
    }
}

// actualizarTarea
exports.actualizarTarea = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json({ errores: errors.array() });
    }

    try {
        // obtener variables
        const { nombre, estado } = req.body;
        const nuevoTarea = {};

        if(nombre) {
            nuevoTarea.nombre = nombre;
        }

        if(typeof estado === "boolean") {
            nuevoTarea.estado = estado;
        }

        // revisar el proyectoId
        let tarea = await Tarea.exists({ _id: req.params.id });

        if (!tarea) {
            return res.status(404).json({ msg: 'Tarea no encontrada.' });
        } else {
            tarea = await Tarea.findById(req.params.id);
        }

        let proyecto = await Proyecto.findById(tarea.proyectoId);

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({ msg: "Usuario no autorizado." });
        }

        // actualizar la tarea
        tarea =  await Tarea.findByIdAndUpdate({_id: req.params.id}, 
            { $set: nuevoTarea }, 
            { new: true } 
        );

        res.json({tarea});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error." });
    }
}

// Elmina un tarea por su ID
exports.eliminarTarea = async (req, res) => {
    try {
        // revisar el id de la tarea
        let tarea = await Tarea.exists({ _id: req.params.id });

        if (!tarea) {
            return res.status(404).json({ msg: 'Tarea no encontrada.' });
        } else {
            tarea = await Tarea.findById(req.params.id);
        }

        let proyecto = await Proyecto.findById(tarea.proyectoId);

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({ msg: "Usuario no autorizado." });
        }

        // eliminar el proyecto
        tarea =  await Tarea.findOneAndRemove({ _id: req.params.id});

        res.json({ msg: 'Tarea eliminada' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error." });
    }
}