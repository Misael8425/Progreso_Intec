const pensumService = require('../services/pensum.service');

async function obtenerPensum(req, res) {
  try {
    const pensum = await pensumService.obtenerPensum();
    console.log("Datos enviados al frontend:", pensum.length);
    return res.status(200).json(pensum);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el pensum.', detalle: error.message });
  }
}

async function actualizarAsignatura(req, res) {
  try {
    const { clave } = req.params;
    const { estado, calificacion } = req.body;

    const actualizada = await pensumService.actualizarAsignatura(clave, { estado, calificacion });
    
    return res.status(200).json({
      message: 'Asignatura actualizada correctamente',
      asignatura: actualizada
    });
  } catch (error) {
    // Si la asignatura no existe, Prisma lanza un error P2025
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `Asignatura con clave ${req.params.clave} no encontrada.` });
    }
    return res.status(400).json({ error: error.message });
  }
}

// Endpoint opcional para inicializar
async function crearAsignatura(req, res) {
  try {
    const { clave, nombre, creditos, trimestreSugerido } = req.body;
    
    if (!clave || !nombre || !creditos || !trimestreSugerido) {
      return res.status(400).json({ error: 'Faltan campos requeridos (clave, nombre, creditos, trimestreSugerido).' });
    }

    const nueva = await pensumService.crearAsignatura({ clave, nombre, creditos, trimestreSugerido });
    return res.status(201).json(nueva);
  } catch (error) {
    // Error de clave duplicada en Prisma P2002
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'La clave de la asignatura ya existe.' });
    }
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  obtenerPensum,
  actualizarAsignatura,
  crearAsignatura
};
