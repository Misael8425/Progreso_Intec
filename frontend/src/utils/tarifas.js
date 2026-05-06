// src/utils/tarifas.js

// 1. Diccionario Histórico de Tarifas (Con recargos de laboratorio)
export const TARIFAS_INTEC = {
  2022: { costoCredito: 3680, carnet: 275, costoLab: 0 },
  2023: { costoCredito: 3943, carnet: 500, costoLab: 0 },
  2024: { costoCredito: 4258, carnet: 525, costoLab: 0 },
  2025: { costoCredito: 4720, carnet: 400, costoLab: 0 },
  2026: { costoCredito: 4815, carnet: 440, costoLab: 4515 }
};

// 2. Obtener tarifa estática por año
export const obtenerTarifa = (anio) => {
  return TARIFAS_INTEC[anio] || TARIFAS_INTEC[2026];
};

// 3. Obtener tarifa dinámica respetando el Ciclo Fiscal (Regla de Febrero/Mayo)
export const obtenerTarifaPorPeriodo = (periodoString) => {
  if (!periodoString) return TARIFAS_INTEC[2026];
  
  const texto = String(periodoString).toLowerCase();
  let anioBase = parseInt(texto.match(/\d{4}/)?.[0] || "2026", 10);
  
  if (texto.includes('febrero')) {
    anioBase -= 1;
  }
  
  if (anioBase < 2022) anioBase = 2022;
  if (anioBase > 2026) anioBase = 2026;
  
  return TARIFAS_INTEC[anioBase];
};

// 4. Calculadora de costo de trimestre completo (Sencilla)
export const calcularCostoTrimestre = (creditos, anio) => {
  const tarifa = obtenerTarifa(anio);
  return (creditos || 0) * tarifa.costoCredito + tarifa.carnet;
};

// 5. Calculadora individual de materias (Detecta laboratorios)
export const calcularCostoMateria = (materia, tarifa) => {
  const creditos = materia.creditos || 0;
  const costoBase = creditos * (tarifa?.costoCredito || 0);
  
  const codigo = String(materia.codigo || materia.clave || materia.claveMateria || '').trim().toUpperCase();
  const nombre = String(materia.nombre || '').trim().toLowerCase();
  
  const esLaboratorio = codigo.endsWith('L') || nombre.includes('lab') || nombre.includes('laboratorio');
  const recargoLab = esLaboratorio && tarifa?.costoLab ? tarifa.costoLab : 0;
  
  return {
    costoBase,
    recargoLab,
    total: costoBase + recargoLab,
    esLab: esLaboratorio
  };
};

// 6. Formateador de Moneda Dominicana
export const formatearDinero = (monto) => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP'
  }).format(monto || 0);
};
