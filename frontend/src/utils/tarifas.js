// src/utils/tarifas.js

// ────────────────────────────────────────────────────────────────────────────
// 1. Tarifas por ciclo fiscal (las nuevas tarifas entran en MAYO de cada año)
// ────────────────────────────────────────────────────────────────────────────
export const TARIFAS_INTEC = {
  2022: { costoCredito: 3680, carnet: 275, costoLab: 0 },
  2023: { costoCredito: 3943, carnet: 500, costoLab: 0 },
  2024: { costoCredito: 4258, carnet: 525, costoLab: 0 },
  2025: { costoCredito: 4720, carnet: 400, costoLab: 0 },
  // Verificado con el recibo del T17 (Ago-Oct 2026): 10 cr × 4.815 + 1 lab × 4.515 + carnet 440 = 53.105
  2026: { costoCredito: 4815, carnet: 440, costoLab: 4515 },
};

const ANIOS = Object.keys(TARIFAS_INTEC).map(Number);
const ANIO_MIN = Math.min(...ANIOS);
const ANIO_MAX = Math.max(...ANIOS); // los años futuros usan la última tarifa conocida

// ────────────────────────────────────────────────────────────────────────────
// 2. Pagos registrados (recibos). La clave es el período tal como está guardado
//    en la base de datos. Cada trimestre puede pagarse en varias cuotas.
//    Cuando existen pagos, su suma es el total real del trimestre (incluye
//    descuentos que INTEC haya aplicado). `estimado: true` marca una cuota sin
//    comprobante, deducida del total: reemplazarla cuando aparezca el recibo.
// ────────────────────────────────────────────────────────────────────────────
export const PAGOS_REGISTRADOS = {
  // T16 · Subtotal 53.105,00 pagado en 3 cuotas (30 % / 35 % / 35 %), sin descuento
  'Mayo - Julio 2026': [
    { monto: 15931.5,  fecha: '2026-05-09', referencia: '000000023176' },
    { monto: 18586.75, fecha: null,         referencia: null, estimado: true }, // 53.105 − 15.931,50 − 18.586,75
    { monto: 18586.75, fecha: '2026-07-02', referencia: '000000028441' },
  ],
  // T17 · Pago único web (53.105,00 − 5 %)
  'Agosto - Octubre 2026': [
    { monto: 50449.75, fecha: '2026-08-06', referencia: '000000032318' },
  ],
};

// Política de cobro de materias retiradas (R). Cambiar a true si INTEC las cobra.
export const COBRAR_MATERIAS_RETIRADAS = false;

// Calificaciones que no generan cobro: convalidada (CO) y examen de ingreso (EI)
const SIN_COBRO = ['CO', 'EI'];

// ────────────────────────────────────────────────────────────────────────────
// 3. Obtener tarifa
// ────────────────────────────────────────────────────────────────────────────
const limitarAnio = (anio) => Math.min(Math.max(anio, ANIO_MIN), ANIO_MAX);

export const obtenerTarifa = (anio) => TARIFAS_INTEC[limitarAnio(anio)];

// Respeta el ciclo fiscal: "Febrero - Abril" usa la tarifa del año anterior.
// Acepta el año por separado (campo `anio` de la BD) por si el período no lo incluye.
export const obtenerTarifaPorPeriodo = (periodoString, anioExplicito) => {
  if (!periodoString) return TARIFAS_INTEC[ANIO_MAX];

  const texto = String(periodoString).toLowerCase();
  const anioEnTexto = parseInt(texto.match(/\d{4}/)?.[0], 10);
  let anioBase = anioEnTexto || anioExplicito || new Date().getFullYear();

  if (texto.includes('febrero')) anioBase -= 1;

  return TARIFAS_INTEC[limitarAnio(anioBase)];
};

// ────────────────────────────────────────────────────────────────────────────
// 4. Detección de laboratorio (código terminado en L o nombre que empieza por "Laboratorio")
// ────────────────────────────────────────────────────────────────────────────
export const esLaboratorio = (codigo = '', nombre = '') => {
  const cod = String(codigo).trim().toUpperCase();
  const nom = String(nombre).trim().toLowerCase();
  return cod.endsWith('L') || nom.startsWith('laboratorio');
};

// ────────────────────────────────────────────────────────────────────────────
// 5. Costo individual de una materia
// ────────────────────────────────────────────────────────────────────────────
export const calcularCostoMateria = (materia, tarifa) => {
  const creditos = materia.creditos || 0;
  const costoBase = creditos * (tarifa?.costoCredito || 0);
  const codigo = materia.codigo || materia.clave || materia.claveMateria || '';
  const esLab = esLaboratorio(codigo, materia.nombre);
  const recargoLab = esLab && tarifa?.costoLab ? tarifa.costoLab : 0;

  return { costoBase, recargoLab, total: costoBase + recargoLab, esLab };
};

// ────────────────────────────────────────────────────────────────────────────
// 6. Desglose completo de un trimestre
//    trimestre = { periodo, anio?, asignaturas: [{ claveMateria, calificacion,
//                  asignaturaPensum: { creditos, nombre } }] }
// ────────────────────────────────────────────────────────────────────────────
const seCobra = (asig) => {
  const calif = String(asig.calificacion || '').toUpperCase();
  if (SIN_COBRO.includes(calif)) return false;
  if (calif === 'R' && !COBRAR_MATERIAS_RETIRADAS) return false;
  return true;
};

export const calcularDesgloseTrimestre = (trimestre) => {
  const tarifa = obtenerTarifaPorPeriodo(trimestre?.periodo, trimestre?.anio);
  const materias = trimestre?.asignaturas ?? [];

  let creditosCalculados = 0;
  let laboratorios = 0;

  for (const asig of materias) {
    if (!seCobra(asig)) continue;
    const pensum = asig.asignaturaPensum ?? {};
    const cr = pensum.creditos ?? asig.creditos ?? 0;
    const codigo = asig.claveMateria ?? asig.clave ?? '';
    creditosCalculados += cr;
    if (cr > 0 && esLaboratorio(codigo, pensum.nombre)) laboratorios += 1;
  }

  // Los créditos del récord oficial (CR del trimestre) son la fuente más fiable:
  // las electivas genéricas del pensum no siempre guardan el crédito real de la
  // materia que se cursó. Si no hay dato, se usa la suma de las materias.
  const creditos = trimestre?.creditosAprobados > 0 ? trimestre.creditosAprobados : creditosCalculados;

  const costoCreditos = creditos * tarifa.costoCredito;
  const recargoLabs = laboratorios * (tarifa.costoLab || 0);
  const carnet = creditos > 0 ? tarifa.carnet : 0;
  const subtotal = costoCreditos + recargoLabs + carnet;

  // Si hay pagos registrados, su suma es el total real
  const pagos = PAGOS_REGISTRADOS[trimestre?.periodo] ?? null;
  const total = pagos ? pagos.reduce((acc, p) => acc + p.monto, 0) : subtotal;
  const pagadoConRecibo = pagos ? pagos.filter(p => !p.estimado).reduce((acc, p) => acc + p.monto, 0) : 0;
  const montoEstimado = pagos ? pagos.filter(p => p.estimado).reduce((acc, p) => acc + p.monto, 0) : 0;
  const descuento = Math.max(subtotal - total, 0);
  const porcentajeDescuento = subtotal > 0 ? (descuento / subtotal) * 100 : 0;

  return {
    tarifa,
    creditos,
    laboratorios,
    costoCreditos,
    recargoLabs,
    carnet,
    subtotal,
    descuento,
    porcentajeDescuento,
    total,
    pagos,
    pagadoConRecibo,
    montoEstimado,
  };
};

// ────────────────────────────────────────────────────────────────────────────
// 7. Formateador de moneda dominicana
// ────────────────────────────────────────────────────────────────────────────
export const formatearDinero = (monto) =>
  new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
  }).format(monto || 0);
