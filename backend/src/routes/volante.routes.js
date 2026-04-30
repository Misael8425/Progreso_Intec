const express = require('express');
const router = express.Router();
const volanteController = require('../controllers/volante.controller');

// Endpoint para obtener el volante activo
router.get('/volantes/activo', volanteController.obtenerVolanteActivo);

// Endpoint para registrar un nuevo volante
router.post('/volantes', volanteController.registrarVolante);

// Endpoint para historial de volantes
router.get('/volantes', volanteController.obtenerHistorial);

module.exports = router;
