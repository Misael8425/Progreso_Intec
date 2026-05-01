const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const pensumService = require('./pensum.service');

const valoresCalificacion = {
  'A+': 4.00,
  'A': 3.75,
  'B+': 3.50,
  'B': 3.00,
  'C+': 2.50,
  'C': 2.00,
  'D': 1.00,
  'F': 0.00,
  'CO': 0, // Convalidada (no afecta GPA)
  'EI': 0, // Examen de Ingreso (no afecta GPA)
  'R': 0   // Retirada (no afecta GPA)
};

async function registrarTrimestre(data) {
  const { periodo, anio, asignaturas } = data;

  if (!periodo || !anio || !Array.isArray(asignaturas) || asignaturas.length === 0) {
    throw new Error('Debe proveer periodo, anio y un arreglo de asignaturas válidas.');
  }

  let sumaPuntos = 0;
  let sumaCreditos = 0;
  const asignaturasAInsertar = [];

  for (const asig of asignaturas) {
    // Buscar la materia en el pensum para obtener sus créditos
    const materiaPensum = await prisma.asignaturaPensum.findUnique({
      where: { clave: asig.claveMateria }
    });

    if (!materiaPensum) {
      throw new Error(`La materia con clave ${asig.claveMateria} no existe en el Pensum.`);
    }

    let calificacionMayus = asig.calificacion ? asig.calificacion.toUpperCase() : null;
    
    let puntosAsignatura = 0;
    
    if (calificacionMayus) {
      const valorPuntos = valoresCalificacion[calificacionMayus];
      if (valorPuntos === undefined) {
        throw new Error(`Calificación literal inválida: ${asig.calificacion}`);
      }

      const creditos = materiaPensum.creditos;
      const omitirDeIndice = ['CO', 'EI', 'R'].includes(calificacionMayus);
      
      // Si la materia tiene 0 créditos (como Orientación, algunas de Inglés), no suma al índice, 
      // y si es una nota especial tampoco.
      if (creditos > 0 && !omitirDeIndice) {
        puntosAsignatura = creditos * valorPuntos;
        sumaPuntos += puntosAsignatura;
        sumaCreditos += creditos;
      }
    } else {
      calificacionMayus = "CURSANDO"; // o null si la dejamos pendiente
    }

    asignaturasAInsertar.push({
      claveMateria: asig.claveMateria,
      calificacion: asig.calificacion || "CURSANDO",
      puntos: puntosAsignatura
    });

    // Sincronizar automáticamente el Pensum
    if (asig.calificacion) {
      await pensumService.actualizarAsignatura(asig.claveMateria, { calificacion: calificacionMayus });
    } else {
      await pensumService.actualizarAsignatura(asig.claveMateria, { estado: 'Cursando' });
    }
  }

  let indiceTrimestral = 0;
  if (sumaCreditos > 0) {
    const indiceBruto = sumaPuntos / sumaCreditos;
    indiceTrimestral = Math.round(indiceBruto * 100) / 100;
  }

  const trimestre = await prisma.trimestre.create({
    data: {
      periodo,
      anio,
      indiceTrimestral,
      asignaturas: {
        create: asignaturasAInsertar
      }
    },
    include: {
      asignaturas: {
        include: {
          asignaturaPensum: true // Incluimos la info del pensum al devolver
        }
      }
    }
  });

  return trimestre;
}

async function obtenerHistorial() {
  const trimestres = await prisma.trimestre.findMany({
    orderBy: [
      { createdAt: 'asc' }
    ],
    include: {
      asignaturas: {
        include: {
          asignaturaPensum: true // Traemos nombre, créditos, etc.
        }
      }
    }
  });
  return trimestres;
}

module.exports = {
  registrarTrimestre,
  obtenerHistorial
};
