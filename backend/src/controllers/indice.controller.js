const indiceService = require('../services/indice.service');

async function calcularYGuardar(req, res) {
  try {
    const asignaturas = req.body.asignaturas;
    
    if (!asignaturas) {
      return res.status(400).json({ error: 'Falta el campo "asignaturas" en el body.' });
    }

    const simulacion = await indiceService.calcularIndiceYGuardar(asignaturas);
    
    return res.status(201).json({
      message: 'Simulación calculada y guardada con éxito',
      simulacion
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function obtenerHistorial(req, res) {
  try {
    const historial = await indiceService.obtenerHistorial();
    return res.status(200).json(historial);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el historial de simulaciones.', detalle: error.message });
  }
}

module.exports = {
  calcularYGuardar,
  obtenerHistorial
};
