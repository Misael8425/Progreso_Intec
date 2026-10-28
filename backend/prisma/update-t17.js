// OBSOLETO desde el T18: usar update-t18.js. Este script deja el T17 como trimestre activo si se vuelve a ejecutar.
// Actualización NO destructiva: pasa la base de datos de T16 a T17 sin borrar nada más.
// Uso: node prisma/update-t17.js   (o: npm run update:t17)
// Es idempotente: se puede ejecutar más de una vez.
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PERIODO_T16 = 'Mayo - Julio 2026';
const PERIODO_T17 = 'Agosto - Octubre 2026';

// Calificaciones finales según el récord impreso el 21/10/2026
const PENSUM = {
  CBM208:  'C',  IDS328:  'A+', IDS328L: 'A+',
  INS380:  'A',  INS380L: 'A',
};

const T16 = {
  estado: 'CERRADO', creditosAprobados: 10, gpa: 2.5, indiceTrimestral: 2.5, indiceAcumulado: 3.55,
  notas: { CBM208: ['D', 5], IDS328: ['A+', 16], IDS328L: ['A+', 4] },
  detalle: {
    CBM208:  { profesor: 'Giro Guillermo Candelario Villalona', horario: 'Lun/Mier 20-22, Vier 18-19', aula: 'GC-313/VIRTU' },
    IDS328:  { profesor: 'Gabriel Elivan Villalona Eusebio',    horario: 'Lun/Mier 18-20',            aula: 'ER-202/VIRTU' },
    IDS328L: { profesor: 'Gabriel Elivan Villalona Eusebio',    horario: 'Sáb 09-12',                 aula: 'LABT1411' },
  },
};
const T17 = {
  estado: 'ACTIVO', creditosAprobados: 10, gpa: 2.88, indiceTrimestral: 2.88, indiceAcumulado: 3.52,
  notas: { CBM208: ['C', 10], INS380: ['A', 15], INS380L: ['A', 3.75] },
  detalle: {
    CBM208:  { profesor: 'Pedro Jesus Lalondriz Mateo',     horario: 'Lun/Mier 07-09, Vier 07-08', aula: 'EL402/VIRTU' },
    INS380:  { profesor: 'Jhonny De Jesus Liriano Batista', horario: 'Mar/Jue 18-20',              aula: 'GC-213' },
    INS380L: { profesor: 'Jhonny De Jesus Liriano Batista', horario: 'Sáb 10-13',                  aula: 'LABTI403' },
  },
};

// Volante de Selección T17 (impreso el 6/8/2026, Mis Clases · BeeCampus)
const VOLANTE_T17 = [
  { claveMateria: 'CBM208',  profesor: 'Pedro Jesus Lalondriz Mateo',     dia: 'Lunes y Miércoles', horas: '07:00 - 09:00', aula: 'EL402 (Presencial)' },
  { claveMateria: 'CBM208',  profesor: 'Pedro Jesus Lalondriz Mateo',     dia: 'Viernes',           horas: '07:00 - 08:00', aula: 'VIRTUAL' },
  { claveMateria: 'INS380',  profesor: 'Jhonny De Jesus Liriano Batista', dia: 'Martes y Jueves',   horas: '18:00 - 20:00', aula: 'GC-213' },
  { claveMateria: 'INS380L', profesor: 'Jhonny De Jesus Liriano Batista', dia: 'Sábado',            horas: '10:00 - 13:00', aula: 'LABTI403' },
];

async function upsertTrimestre(periodo, cfg) {
  let t = await prisma.trimestre.findFirst({ where: { periodo }, include: { asignaturas: true } });
  const datos = {
    estado: cfg.estado, creditosAprobados: cfg.creditosAprobados, gpa: cfg.gpa,
    indiceTrimestral: cfg.indiceTrimestral, indiceAcumulado: cfg.indiceAcumulado,
  };
  if (!t) {
    t = await prisma.trimestre.create({ data: { periodo, ...datos }, include: { asignaturas: true } });
    console.log(`+ Trimestre creado: ${periodo}`);
  } else {
    await prisma.trimestre.update({ where: { id: t.id }, data: datos });
    console.log(`~ Trimestre actualizado: ${periodo}`);
  }
  for (const [clave, [calif, pts]] of Object.entries(cfg.notas)) {
    const existente = t.asignaturas.find(a => a.claveMateria === clave);
    const extra = cfg.detalle?.[clave] ?? {};
    const datosAsig = { calificacion: calif, puntos: pts, ...extra };
    if (existente) {
      await prisma.asignaturaCursada.update({ where: { id: existente.id }, data: datosAsig });
    } else {
      await prisma.asignaturaCursada.create({ data: { trimestreId: t.id, claveMateria: clave, ...datosAsig } });
    }
  }
}

async function main() {
  console.log('Actualizando a T17 (Agosto - Octubre 2026)...');

  await upsertTrimestre(PERIODO_T16, T16);
  await upsertTrimestre(PERIODO_T17, T17);

  // Pensum: estados y calificaciones finales
  for (const [clave, calificacion] of Object.entries(PENSUM)) {
    const r = await prisma.asignaturaPensum.updateMany({ where: { clave }, data: { estado: 'Aprobada', calificacion } });
    if (r.count === 0) console.warn(`! No existe ${clave} en el pensum`);
  }

  // Volante: desactivar los anteriores y dejar activo el de T17
  await prisma.volanteSeleccion.updateMany({ where: { periodo: { not: PERIODO_T17 } }, data: { activo: false } });
  // Se reemplazan los horarios del volante T17 por los reales (idempotente)
  const v = await prisma.volanteSeleccion.findUnique({ where: { periodo: PERIODO_T17 } });
  if (!v) {
    await prisma.volanteSeleccion.create({
      data: { periodo: PERIODO_T17, activo: true, horarios: { create: VOLANTE_T17 } },
    });
    console.log('+ Volante T17 creado con horarios');
  } else {
    await prisma.horarioAsignatura.deleteMany({ where: { volanteId: v.id } });
    await prisma.volanteSeleccion.update({
      where: { id: v.id },
      data: { activo: true, horarios: { create: VOLANTE_T17 } },
    });
    console.log('~ Volante T17 actualizado con horarios');
  }

  console.log('✅ Listo.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
