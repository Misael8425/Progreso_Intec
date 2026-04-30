const trimestreService = require('../services/trimestre.service');

async function registrarTrimestre(req, res) {
  try {
    const { periodo, anio, asignaturas } = req.body;

    const trimestre = await trimestreService.registrarTrimestre({ periodo, anio, asignaturas });
    
    return res.status(201).json({
      message: 'Trimestre registrado exitosamente',
      trimestre
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function obtenerHistorial(req, res) {
  try {
    const trimestres = await trimestreService.obtenerHistorial();
    return res.status(200).json(trimestres);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el historial.', detalle: error.message });
  }
}

module.exports = {
  registrarTrimestre,
  obtenerHistorial
};
