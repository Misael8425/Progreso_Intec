const trimestreService = require('../services/trimestre.service');

async function registrarTrimestre(req, res) {
  console.log("[TRIMESTRES] request received: registrarTrimestre");
  try {
    const { periodo, anio, asignaturas } = req.body;

    const trimestre = await trimestreService.registrarTrimestre({ periodo, anio, asignaturas });
    
    return res.status(201).json({
      message: 'Trimestre registrado exitosamente',
      trimestre: trimestre ?? {}
    });
  } catch (error) {
    console.error("[TRIMESTRES] Error en registrarTrimestre:", error);
    return res.status(500).json({ error: "Error interno en Trimestres" });
  }
}

async function obtenerHistorial(req, res) {
  console.log("[TRIMESTRES] request received: obtenerHistorial");
  try {
    const trimestres = await trimestreService.obtenerHistorial();
    return res.status(200).json(trimestres ?? []);
  } catch (error) {
    console.error("[TRIMESTRES] Error en obtenerHistorial:", error);
    return res.status(500).json({ error: "Error interno en Trimestres" });
  }
}

module.exports = {
  registrarTrimestre,
  obtenerHistorial
};
