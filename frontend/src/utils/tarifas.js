/**
 * Tarifas históricas del INTEC extraídas de los registros financieros del estudiante.
 * Fuente: volantes de pago oficiales por año académico.
 */
export const TARIFAS_INTEC = {
  2022: { costoCredito: 3680, carnet: 275, costoLab: 0 },
  2023: { costoCredito: 3943, carnet: 500, costoLab: 0 },
  2024: { costoCredito: 4258, carnet: 525, costoLab: 0 },
  2025: { costoCredito: 4720, carnet: 400, costoLab: 0 },    // Vigente hasta Feb-Abr 2026
  2026: { costoCredito: 4815, carnet: 440, costoLab: 4515 }  // Vigente desde May-Jul 2026 en adelante
};

/**
 * Calcula el costo total de un trimestre dado el número de créditos y el año.
 * @param {number} creditos - Total de créditos a cursar en el trimestre.
 * @param {number} anio - Año académico (ej. 2026).
 * @returns {number} Costo total en pesos dominicanos (DOP).
 */
export const calcularCostoTrimestre = (creditos, anio) => {
  const tarifa = TARIFAS_INTEC[anio] || TARIFAS_INTEC[2026];
  return creditos * tarifa.costoCredito + tarifa.carnet;
};

/**
 * Formatea un monto numérico a pesos dominicanos (DOP).
 * Ejemplo: 45550 → "RD$ 45,550.00"
 * @param {number} monto
 * @returns {string}
 */
export const formatearDinero = (monto) => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
  }).format(monto);
};

/**
 * Obtiene la tarifa vigente para un año específico.
 * @param {number} anio
 * @returns {{ costoCredito: number, carnet: number }}
 */
export const obtenerTarifa = (anio) => {
  return TARIFAS_INTEC[anio] || TARIFAS_INTEC[2026];
};

/**
 * Calcula el costo detallado de una materia individual, detectando laboratorios
 * y aplicando la cuota fija que corresponda a la tarifa vigente del período.
 *
 * @param {{ nombre: string, codigo: string, creditos: number }} materia
 * @param {{ costoCredito: number, carnet: number, costoLab: number }} tarifa
 * @returns {{ costoBase: number, recargoLab: number, total: number, esLab: boolean }}
 */
export const calcularCostoMateria = (materia, tarifa) => {
  // 1. Costo base por créditos
  const costoBase = materia.creditos * tarifa.costoCredito;

  // 2. Detección de Laboratorio por sufijo 'L' en el código o palabra 'lab' en el nombre
  const nombreNormalizado = materia.nombre.toLowerCase();
  const esLaboratorio = materia.codigo.endsWith('L') || nombreNormalizado.includes('lab');

  // 3. Aplicación de Cuota Fija (solo si es lab y la tarifa de ese año lo contempla)
  const recargoLab = esLaboratorio && tarifa.costoLab ? tarifa.costoLab : 0;

  return {
    costoBase,
    recargoLab,
    total: costoBase + recargoLab,
    esLab: esLaboratorio,
  };
};

/**
 * Resuelve la tarifa correcta a partir del string de período,
 * aplicando la regla de negocio del INTEC:
 *   - Las tarifas nuevas entran en vigencia en el trimestre Mayo-Julio.
 *   - Por lo tanto, "Febrero - Abril" aplica la tarifa del año ANTERIOR.
 *
 * Ejemplos:
 *   "Febrero - Abril 2023"           → tarifa 2022
 *   "Mayo - Julio 2023"              → tarifa 2023
 *   "Agosto - Octubre 2023"          → tarifa 2023
 *   "Noviembre 2023 - Enero 2024"    → tarifa 2023 (primer año encontrado)
 *
 * @param {string} periodoString
 * @returns {{ costoCredito: number, carnet: number }}
 */
export const obtenerTarifaPorPeriodo = (periodoString) => {
  if (!periodoString) return TARIFAS_INTEC[2026];

  const texto = periodoString.toLowerCase();
  // Extrae el primer año que encuentre en el string (ej. "2026" de "Febrero - Abril 2026")
  let anioBase = parseInt(periodoString.match(/\d{4}/)?.[0] || '2026', 10);

  // REGLA DE NEGOCIO ESTRICTA: El año fiscal tarifario empieza en MAYO.
  // Si el trimestre es "Febrero - Abril", se cobra con la tarifa del año anterior.
  if (texto.includes('febrero')) {
    anioBase -= 1;
  }

  // Fallbacks de seguridad por si hay años fuera de rango en la base de datos
  if (anioBase < 2022) anioBase = 2022;
  if (anioBase > 2026) anioBase = 2026; // Hasta que INTEC anuncie la tarifa 2027

  return TARIFAS_INTEC[anioBase];
};
