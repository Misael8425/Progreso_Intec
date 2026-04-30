const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function obtenerVolanteActivo() {
  const volante = await prisma.volanteSeleccion.findFirst({
    where: { activo: true },
    include: {
      horarios: {
        include: {
          asignaturaPensum: true
        }
      }
    }
  });
  return volante;
}

async function registrarVolante(data) {
  const { periodo, activo, horarios } = data;

  if (!periodo || !Array.isArray(horarios)) {
    throw new Error('Debe proveer periodo y un arreglo de horarios.');
  }

  // Si se envía activo: true, apagamos todos los demás
  const esActivo = activo !== undefined ? activo : true;
  
  if (esActivo) {
    await prisma.volanteSeleccion.updateMany({
      where: { activo: true },
      data: { activo: false }
    });
  }

  // Creación del nuevo volante en una transacción
  const nuevoVolante = await prisma.volanteSeleccion.create({
    data: {
      periodo,
      activo: esActivo,
      horarios: {
        create: horarios.map(h => ({
          claveMateria: h.claveMateria,
          profesor: h.profesor,
          dia: h.dia,
          horas: h.horas,
          aula: h.aula
        }))
      }
    },
    include: {
      horarios: true
    }
  });

  return nuevoVolante;
}

async function obtenerHistorialVolantes() {
  const volantes = await prisma.volanteSeleccion.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      horarios: true
    }
  });
  return volantes;
}

module.exports = {
  obtenerVolanteActivo,
  registrarVolante,
  obtenerHistorialVolantes
};
