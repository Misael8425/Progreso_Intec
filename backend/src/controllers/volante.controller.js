const volanteService = require('../services/volante.service');

async function obtenerVolanteActivo(req, res) {
  console.log("[VOLANTES] request received: obtenerVolanteActivo");
  try {
    const volante = await volanteService.obtenerVolanteActivo();
    if (!volante) {
      return res.status(404).json({ message: 'No hay ningún volante de selección activo en este momento.' });
    }
    return res.status(200).json(volante);
  } catch (error) {
    console.error("[VOLANTES] Error en obtenerVolanteActivo:", error);
    return res.status(500).json({ error: "Error interno en Volantes" });
  }
}

async function registrarVolante(req, res) {
  console.log("[VOLANTES] request received: registrarVolante");
  try {
    const volante = await volanteService.registrarVolante(req.body);
    return res.status(201).json({
      message: 'Volante de selección registrado correctamente',
      volante: volante ?? {}
    });
  } catch (error) {
    console.error("[VOLANTES] Error en registrarVolante:", error);
    return res.status(500).json({ error: "Error interno en Volantes" });
  }
}

async function obtenerHistorial(req, res) {
  console.log("[VOLANTES] request received: obtenerHistorial");
  try {
    const volantes = await volanteService.obtenerHistorialVolantes();
    return res.status(200).json(volantes ?? []);
  } catch (error) {
    console.error("[VOLANTES] Error en obtenerHistorial:", error);
    return res.status(500).json({ error: "Error interno en Volantes" });
  }
}

module.exports = {
  obtenerVolanteActivo,
  registrarVolante,
  obtenerHistorial
};
