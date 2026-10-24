// src/utils/plan.js
// Datos del plan de estudios IDS-2020 (Ingeniería de Software, INTEC)

export const PLAN = {
  totalCreditos: 279,
  totalMaterias: 113,
  // Máximo de trimestres que INTEC permite para terminar la carrera
  trimestresPermanencia: 20,
};

// Devuelve el nombre del período que sigue al dado, con el formato que usa la BD:
//   "Agosto - Octubre 2026"     → "Noviembre 2026 - Enero 2027"
//   "Noviembre 2026 - Enero 2027" → "Febrero - Abril 2027"
//   "Febrero - Abril 2027"      → "Mayo - Julio 2027"
//   "Mayo - Julio 2027"         → "Agosto - Octubre 2027"
export const siguientePeriodo = (periodo) => {
  const texto = String(periodo || '').toLowerCase();
  const anio = parseInt(texto.match(/\d{4}/)?.[0], 10);
  if (!anio) return null;

  if (texto.startsWith('febrero')) return `Mayo - Julio ${anio}`;
  if (texto.startsWith('mayo')) return `Agosto - Octubre ${anio}`;
  if (texto.startsWith('agosto')) return `Noviembre ${anio} - Enero ${anio + 1}`;
  if (texto.startsWith('noviembre')) return `Febrero - Abril ${anio + 1}`;
  return null;
};

// Lista los próximos `cantidad` períodos a partir del último registrado
export const periodosRestantes = (ultimoPeriodo, cantidad) => {
  const lista = [];
  let actual = ultimoPeriodo;
  for (let i = 0; i < cantidad; i++) {
    actual = siguientePeriodo(actual);
    if (!actual) break;
    lista.push(actual);
  }
  return lista;
};
