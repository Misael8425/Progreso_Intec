const volanteService = require('../services/volante.service');

async function obtenerVolanteActivo(req, res) {
  try {
    const volante = await volanteService.obtenerVolanteActivo();
    if (!volante) {
      return res.status(404).json({ message: 'No hay ningún volante de selección activo en este momento.' });
    }
    return res.status(200).json(volante);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el volante activo.', detalle: error.message });
  }
}

async function registrarVolante(req, res) {
  try {
    const volante = await volanteService.registrarVolante(req.body);
    return res.status(201).json({
      message: 'Volante de selección registrado correctamente',
      volante
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function obtenerHistorial(req, res) {
  try {
    const volantes = await volanteService.obtenerHistorialVolantes();
    return res.status(200).json(volantes);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el historial de volantes.' });
  }
}

module.exports = {
  obtenerVolanteActivo,
  registrarVolante,
  obtenerHistorial
};
