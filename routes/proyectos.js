// rutas para crear proyectos
const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Crea proyectos
// api/proyectos
router.post('/', 
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

// obtener los proyectos del usuario
router.get('/', 
    auth,
    proyectoController.obtenerProyectos
);

// actualizar proyecto via ID
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

// Eliminar un proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;