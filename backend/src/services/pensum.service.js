const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const notasAprobatorias = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'CO', 'EI'];
const notasReprobatorias = ['D', 'F'];

async function obtenerPensum() {
  return await prisma.asignaturaPensum.findMany({
    orderBy: {
      updatedAt: 'desc'
    }
  });
}

async function actualizarAsignatura(clave, data) {
  let { estado, calificacion } = data;

  if (calificacion !== undefined && calificacion !== null) {
    const calificacionMayus = calificacion.toUpperCase();
    
    if (notasAprobatorias.includes(calificacionMayus)) {
      estado = 'Aprobada';
      calificacion = calificacionMayus;
    } else if (notasReprobatorias.includes(calificacionMayus)) {
      estado = 'Reprobada';
      calificacion = calificacionMayus;
    } else if (calificacionMayus === 'R') {
      estado = 'Pendiente'; // Retirada vuelve a quedar pendiente
      calificacion = 'R';
    } else {
      throw new Error(`Calificación literal inválida: ${calificacion}`);
    }
  }

  // Si el usuario fuerza un estado manual
  if (estado === 'Cursando' || estado === 'Pendiente') {
    calificacion = null;
  }

  const payload = {};
  if (estado !== undefined) payload.estado = estado;
  if (calificacion !== undefined) payload.calificacion = calificacion;

  // Actualizar en base de datos
  const asignaturaActualizada = await prisma.asignaturaPensum.update({
    where: { clave },
    data: payload
  });

  return asignaturaActualizada;
}

// Opcional para poblar datos iniciales
async function crearAsignatura(data) {
  return await prisma.asignaturaPensum.create({
    data
  });
}

module.exports = {
  obtenerPensum,
  actualizarAsignatura,
  crearAsignatura
};
