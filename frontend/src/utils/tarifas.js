/**
 * Tarifas históricas del INTEC extraídas de los registros financieros del estudiante.
 * Fuente: volantes de pago oficiales por año académico.
 */
export const TARIFAS_INTEC = {
  2022: { costoCredito: 3680, carnet: 275 },
  2023: { costoCredito: 3943, carnet: 500 },
  2024: { costoCredito: 4258, carnet: 525 },
  2025: { costoCredito: 4720, carnet: 400 }, // Valor real ajustado
  2026: { costoCredito: 4515, carnet: 400 },
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

  const aniosEncontrados = periodoString.match(/\d{4}/g);
  if (!aniosEncontrados) return TARIFAS_INTEC[2026];

  // Primer año mencionado en el string (el año de inicio del período)
  let anioTarifa = parseInt(aniosEncontrados[0], 10);

  // REGLA DE NEGOCIO INTEC: las tarifas nuevas entran en Mayo.
  // Febrero - Abril usa la tarifa del ciclo anterior (año - 1).
  if (periodoString.toLowerCase().includes('febrero')) {
    anioTarifa -= 1;
  }

  return TARIFAS_INTEC[anioTarifa] || TARIFAS_INTEC[2026];
};
