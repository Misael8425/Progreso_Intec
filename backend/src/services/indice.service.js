const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const valoresCalificacion = {
  'A+': 4.00,
  'A': 3.75,
  'B+': 3.50,
  'B': 3.00,
  'C+': 2.50,
  'C': 2.00,
  'D': 1.00,
  'F': 0.00
};

/**
 * Calcula el índice académico y persiste la simulación en la base de datos.
 * @param {Array<{ creditos: number, calificacionLiteral: string }>} asignaturas 
 */
async function calcularIndiceYGuardar(asignaturas) {
  if (!Array.isArray(asignaturas) || asignaturas.length === 0) {
    throw new Error('Debe proveer un arreglo de asignaturas válido.');
  }

  let sumaPuntos = 0;
  let sumaCreditos = 0;
  const asignaturasAInsertar = [];

  for (const asig of asignaturas) {
    const calificacionMayus = asig.calificacionLiteral.toUpperCase();
    const valorPuntos = valoresCalificacion[calificacionMayus];

    if (valorPuntos === undefined) {
      throw new Error(`Calificación literal inválida: ${asig.calificacionLiteral}`);
    }

    if (typeof asig.creditos !== 'number' || asig.creditos <= 0) {
      throw new Error('Los créditos deben ser un número mayor a cero.');
    }

    const puntosAsignatura = asig.creditos * valorPuntos;
    sumaPuntos += puntosAsignatura;
    sumaCreditos += asig.creditos;

    asignaturasAInsertar.push({
      creditos: asig.creditos,
      calificacionLiteral: calificacionMayus,
      puntos: puntosAsignatura
    });
  }

  const indiceBruto = sumaPuntos / sumaCreditos;
  const indiceRedondeado = Math.round(indiceBruto * 100) / 100;

  // Persistir en base de datos usando transacciones o inserción anidada
  const simulacion = await prisma.simulacion.create({
    data: {
      indiceCalculado: indiceRedondeado,
      asignaturas: {
        create: asignaturasAInsertar
      }
    },
    include: {
      asignaturas: true
    }
  });

  return simulacion;
}

/**
 * Obtiene el historial de simulaciones ordenado del más reciente al más antiguo
 */
async function obtenerHistorial() {
  const historial = await prisma.simulacion.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      asignaturas: true
    }
  });
  return historial;
}

module.exports = {
  calcularIndiceYGuardar,
  obtenerHistorial,
  valoresCalificacion
};
