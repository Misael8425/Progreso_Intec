// Ejecutar con: node src/utils/tarifas.test.mjs
import assert from 'node:assert/strict';
import { calcularDesgloseTrimestre, obtenerTarifaPorPeriodo } from './tarifas.js';

const mat = (clave, nombre, creditos, calificacion) => ({
  claveMateria: clave, calificacion, asignaturaPensum: { nombre, creditos },
});

// T17 – Agosto-Octubre 2026 (recibo Nº 000000032318)
const t17 = calcularDesgloseTrimestre({
  periodo: 'Agosto - Octubre 2026',
  asignaturas: [
    mat('CBM208', 'ALGEBRA LINEAL', 5, 'C'),
    mat('INS380', 'BASES DE DATOS II', 4, 'A'),
    mat('INS380L', 'LABORATORIO DE BASES DE DATOS II', 1, 'A'),
  ],
});
assert.equal(t17.creditos, 10);
assert.equal(t17.laboratorios, 1);
assert.equal(t17.subtotal, 53105);                 // 10×4815 + 4515 + 440
assert.equal(t17.total, 50449.75);                 // lo realmente pagado
assert.equal(Math.round(t17.porcentajeDescuento * 100) / 100, 5);

// T16 – Mayo-Julio 2026: 3 cuotas, la 2ª estimada, sin descuento
const t16 = calcularDesgloseTrimestre({
  periodo: 'Mayo - Julio 2026',
  asignaturas: [
    mat('CBM208', 'ALGEBRA LINEAL', 5, 'D'),
    mat('IDS328', 'ADMINISTRACION DE CONFIGURACION', 4, 'A+'),
    mat('IDS328L', 'LABORATORIO DE ADMINISTRACION DE CONFIGURACION', 1, 'A+'),
  ],
});
assert.equal(t16.subtotal, 53105);
assert.equal(t16.total, 53105);
assert.equal(t16.descuento, 0);
assert.equal(t16.pagadoConRecibo, 34518.25);
assert.equal(t16.montoEstimado, 18586.75);

// Electiva con crédito 0 en el pensum: manda el CR del récord (4 créditos reales)
const tElec = calcularDesgloseTrimestre({
  periodo: 'Febrero - Abril 2024',
  creditosAprobados: 22,
  asignaturas: [
    mat('EEE2X2', 'ELECTIVAS DE ESTUDIOS ESPECIALIZADOS II', 0, 'A'),
    mat('IDS335', 'DISEÑO DE SOFTWARE', 4, 'A'),
  ],
});
assert.equal(tElec.creditos, 22);
// Feb–Abr usa la tarifa del año anterior (2023): 3.943 por crédito + 500 de carnet
assert.equal(tElec.total, 22 * 3943 + 500);

// T1 – convalidadas (CO/EI) no se cobran
const t1 = calcularDesgloseTrimestre({
  periodo: 'Agosto - Octubre 2022',
  asignaturas: [
    mat('CBF210', 'FISICA MECANICA I', 4, 'CO'),
    mat('SHI103', 'INGLES 01', 0, 'EI'),
    mat('AHC109', 'REDACCION', 4, 'B'),
    mat('AHQ101', 'QUEHACER CIENTIFICO', 4, 'B'),
    mat('IDS207', 'INTRO INGENIERIA DE SOFTWARE', 2, 'A'),
  ],
});
assert.equal(t1.creditos, 10);
assert.equal(t1.total, 10 * 3680 + 275);

// Ciclo fiscal: Feb-Abr usa la tarifa del año anterior; el año puede venir aparte
assert.equal(obtenerTarifaPorPeriodo('Febrero - Abril 2026').costoCredito, 4720);
assert.equal(obtenerTarifaPorPeriodo('Mayo - Julio 2026').costoCredito, 4815);
assert.equal(obtenerTarifaPorPeriodo('Agosto - Octubre', 2023).costoCredito, 3943);
// Año futuro: usa la última tarifa conocida
assert.equal(obtenerTarifaPorPeriodo('Mayo - Julio 2027').costoCredito, 4815);

console.log('✔ tarifas OK');
