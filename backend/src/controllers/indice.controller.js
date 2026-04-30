const indiceService = require('../services/indice.service');

async function calcularYGuardar(req, res) {
  console.log("[INDICE] request received: calcularYGuardar");
  try {
    const asignaturas = req.body.asignaturas;
    
    if (!asignaturas) {
      return res.status(400).json({ error: 'Falta el campo "asignaturas" en el body.' });
    }

    const simulacion = await indiceService.calcularIndiceYGuardar(asignaturas);
    
    return res.status(201).json({
      message: 'Simulación calculada y guardada con éxito',
      simulacion: simulacion ?? {}
    });
  } catch (error) {
    console.error("[INDICE] Error en calcularYGuardar:", error);
    return res.status(500).json({ error: "Error interno en Índice" });
  }
}

async function obtenerHistorial(req, res) {
  console.log("[INDICE] request received: obtenerHistorial");
  try {
    const historial = await indiceService.obtenerHistorial();
    return res.status(200).json(historial ?? []);
  } catch (error) {
    console.error("[INDICE] Error en obtenerHistorial:", error);
    return res.status(500).json({ error: "Error interno en Índice" });
  }
}

module.exports = {
  calcularYGuardar,
  obtenerHistorial
};
