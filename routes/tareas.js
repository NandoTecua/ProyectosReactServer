// rutas para crear proyectos
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// api/tareas
// Crea proyectos
router.post('/', 
    auth,
    [
        check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
        check('proyectoId', 'El nombre es obligatorio.').not().isEmpty()
    ],
    tareaController.crearTarea
);

// Obtener las tareas por proyecto
router.get('/', 
    auth,
    [
        check('proyectoId', 'El nombre es obligatorio.').not().isEmpty()
    ],
    tareaController.obtenerTareas
);

// Actualizar tarea
router.put('/:id',
    auth,
    [
        check('estado', 'El estado debe ser booleano.').isBoolean().optional()
    ],
    tareaController.actualizarTarea
);

// Eliminar un proyecto
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports = router;