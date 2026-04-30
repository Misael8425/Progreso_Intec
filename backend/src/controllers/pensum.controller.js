const pensumService = require('../services/pensum.service');

async function obtenerPensum(req, res) {
  console.log("[PENSUM] request received: obtenerPensum");
  try {
    const pensum = await pensumService.obtenerPensum();
    console.log("Datos enviados al frontend:", pensum?.length || 0);
    return res.status(200).json(pensum ?? []);
  } catch (error) {
    console.error("[PENSUM] Error en obtenerPensum:", error);
    return res.status(500).json({ error: "Error interno en Pensum" });
  }
}

async function actualizarAsignatura(req, res) {
  console.log("[PENSUM] request received: actualizarAsignatura");
  try {
    const { clave } = req.params;
    const { estado, calificacion } = req.body;

    const actualizada = await pensumService.actualizarAsignatura(clave, { estado, calificacion });
    
    return res.status(200).json({
      message: 'Asignatura actualizada correctamente',
      asignatura: actualizada ?? {}
    });
  } catch (error) {
    console.error("[PENSUM] Error en actualizarAsignatura:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `Asignatura con clave ${req.params.clave} no encontrada.` });
    }
    return res.status(500).json({ error: "Error interno en Pensum" });
  }
}

// Endpoint opcional para inicializar
async function crearAsignatura(req, res) {
  console.log("[PENSUM] request received: crearAsignatura");
  try {
    const { clave, nombre, creditos, trimestreSugerido } = req.body;
    
    if (!clave || !nombre || !creditos || !trimestreSugerido) {
      return res.status(400).json({ error: 'Faltan campos requeridos (clave, nombre, creditos, trimestreSugerido).' });
    }

    const nueva = await pensumService.crearAsignatura({ clave, nombre, creditos, trimestreSugerido });
    return res.status(201).json(nueva ?? {});
  } catch (error) {
    console.error("[PENSUM] Error en crearAsignatura:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'La clave de la asignatura ya existe.' });
    }
    return res.status(500).json({ error: "Error interno en Pensum" });
  }
}

module.exports = {
  obtenerPensum,
  actualizarAsignatura,
  crearAsignatura
};
