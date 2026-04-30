const express = require('express');
const router = express.Router();
const trimestreController = require('../controllers/trimestre.controller');

// Endpoint para registrar un trimestre con sus asignaturas cursadas
router.post('/', trimestreController.registrarTrimestre);

// Endpoint para obtener el historial académico ordenado
router.get('/', trimestreController.obtenerHistorial);

module.exports = router;
