// Actualización NO destructiva: cierra el T17 y deja el T18 (Nov 2026 - Ene 2027) como trimestre en curso.
// Uso: npm run update:t18
// Es idempotente: se puede ejecutar más de una vez. No toca finanzas ni simulaciones.
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PERIODO_T17 = 'Agosto - Octubre 2026';
const PERIODO_T18 = 'Noviembre 2026 - Enero 2027';

// Volante impreso el 27/10/2026 (Mis Clases · BeeCampus). Clases del 02/11/2026 al 31/01/2027.
const T18_ASIGNATURAS = [
  { claveMateria: 'CBM203',  profesor: 'Pedro Jesus Lalondriz Mateo',    horario: 'Lun/Mier 18-20, Vier 18-19', aula: 'GC-302/VIRTU' },
  { claveMateria: 'IDS330',  profesor: 'Leopoldo Armando Martinez Diaz', horario: 'Jue 16-19',                  aula: 'GC-313' },
  { claveMateria: 'IDS330L', profesor: 'Leopoldo Armando Martinez Diaz', horario: 'Jue 19-22',                  aula: 'AJ-403' },
];

const VOLANTE_T18 = [
  { claveMateria: 'CBM203',  profesor: 'Pedro Jesus Lalondriz Mateo',    dia: 'Lunes y Miércoles', horas: '18:00 - 20:00', aula: 'GC-302 (Presencial)' },
  { claveMateria: 'CBM203',  profesor: 'Pedro Jesus Lalondriz Mateo',    dia: 'Viernes',           horas: '18:00 - 19:00', aula: 'VIRTUAL' },
  { claveMateria: 'IDS330',  profesor: 'Leopoldo Armando Martinez Diaz', dia: 'Jueves',            horas: '16:00 - 19:00', aula: 'GC-313' },
  { claveMateria: 'IDS330L', profesor: 'Leopoldo Armando Martinez Diaz', dia: 'Jueves',            horas: '19:00 - 22:00', aula: 'AJ-403' },
];

async function main() {
  console.log('Actualizando a T18 (Noviembre 2026 - Enero 2027)...');

  // 1. Cerrar T17
  const t17 = await prisma.trimestre.findFirst({ where: { periodo: PERIODO_T17 } });
  if (!t17) {
    console.warn('! No existe el T17. Ejecuta primero: npm run update:t17');
  } else {
    await prisma.trimestre.update({ where: { id: t17.id }, data: { estado: 'CERRADO' } });
    console.log('~ T17 cerrado');
  }

  // 2. Crear / actualizar T18 (sin notas todavía)
  let t18 = await prisma.trimestre.findFirst({ where: { periodo: PERIODO_T18 }, include: { asignaturas: true } });
  const indiceAcumulado = t17?.indiceAcumulado ?? 3.52;
  if (!t18) {
    t18 = await prisma.trimestre.create({
      data: { periodo: PERIODO_T18, estado: 'ACTIVO', creditosAprobados: 0, indiceAcumulado },
      include: { asignaturas: true },
    });
    console.log('+ T18 creado');
  } else {
    await prisma.trimestre.update({ where: { id: t18.id }, data: { estado: 'ACTIVO' } });
    console.log('~ T18 activado');
  }
  for (const a of T18_ASIGNATURAS) {
    const existente = t18.asignaturas.find(x => x.claveMateria === a.claveMateria);
    if (existente) {
      await prisma.asignaturaCursada.update({ where: { id: existente.id }, data: { profesor: a.profesor, horario: a.horario, aula: a.aula } });
    } else {
      await prisma.asignaturaCursada.create({ data: { trimestreId: t18.id, ...a } });
    }
  }

  // 3. Pensum: las 3 materias pasan a "Cursando"
  for (const a of T18_ASIGNATURAS) {
    const r = await prisma.asignaturaPensum.updateMany({
      where: { clave: a.claveMateria },
      data: { estado: 'Cursando', calificacion: null },
    });
    if (r.count === 0) console.warn(`! No existe ${a.claveMateria} en el pensum`);
  }

  // 4. Volante: desactivar los anteriores y dejar activo el de T18
  await prisma.volanteSeleccion.updateMany({ where: { periodo: { not: PERIODO_T18 } }, data: { activo: false } });
  const v = await prisma.volanteSeleccion.findUnique({ where: { periodo: PERIODO_T18 } });
  if (!v) {
    await prisma.volanteSeleccion.create({
      data: { periodo: PERIODO_T18, activo: true, horarios: { create: VOLANTE_T18 } },
    });
    console.log('+ Volante T18 creado');
  } else {
    await prisma.horarioAsignatura.deleteMany({ where: { volanteId: v.id } });
    await prisma.volanteSeleccion.update({
      where: { id: v.id },
      data: { activo: true, horarios: { create: VOLANTE_T18 } },
    });
    console.log('~ Volante T18 actualizado');
  }

  console.log('✅ Listo.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
