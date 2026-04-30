const express = require('express');
const router = express.Router();
const pensumController = require('../controllers/pensum.controller');

// Endpoint opcional para agregar asignaturas iniciales al pensum
router.post('/', pensumController.crearAsignatura);

// Endpoint para obtener todo el pensum ordenado por updatedAt
router.get('/', pensumController.obtenerPensum);

// Endpoint para actualizar estado y/o calificación de una asignatura
router.put('/:clave', pensumController.actualizarAsignatura);

module.exports = router;
