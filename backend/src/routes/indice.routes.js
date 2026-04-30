const express = require('express');
const router = express.Router();
const indiceController = require('../controllers/indice.controller');

// Endpoint para guardar y calcular simulación
router.post('/', indiceController.calcularYGuardar);

// Endpoint para consultar el historial de simulaciones ordenado
router.get('/', indiceController.obtenerHistorial);

module.exports = router;
