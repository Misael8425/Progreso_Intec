// Actualización NO destructiva: cierra el T17 y deja el T18 (Nov 2026 - Ene 2027) como trimestre en curso.
// Uso: npm run update:t18
// Es idempotente: se puede ejecutar más de una vez. No toca finanzas.
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PENSUM_ACTUAL = require('./data/pensum-ids2020.json'); // Pensum IDS-2020 (docx) + estados según tus colores

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

  // 3b. Pensum actualizado (Consejo Académico, 02/11/2023): ISE2X1 ya no existe y cada
  //     electiva genérica indica qué materia cursaste en ese espacio.
  const ISE2X1_USOS =
    (await prisma.asignaturaCursada.count({ where: { claveMateria: 'ISE2X1' } })) +
    (await prisma.horarioAsignatura.count({ where: { claveMateria: 'ISE2X1' } }));
  if (ISE2X1_USOS === 0) {
    const r = await prisma.asignaturaPensum.deleteMany({ where: { clave: 'ISE2X1' } });
    if (r.count) console.log('- ISE2X1 eliminada del pensum (no existe en el plan actualizado)');
  } else {
    console.warn('! ISE2X1 tiene registros asociados; no se eliminó');
  }
  // 3c. Sincroniza créditos, trimestre sugerido y estado de TODAS las materias con el pensum
  //     actualizado. Corrige bases creadas con un seed anterior (p. ej. electivas con 0 créditos).
  let cambios = 0;
  for (const m of PENSUM_ACTUAL) {
    const actual = await prisma.asignaturaPensum.findUnique({ where: { clave: m.clave } });
    if (!actual) {
      await prisma.asignaturaPensum.create({
        data: { clave: m.clave, nombre: m.nombre, creditos: m.creditos, trimestreSugerido: m.trimestre, estado: m.estado, calificacion: null },
      });
      console.log(`+ ${m.clave} agregada al pensum`);
      cambios++;
      continue;
    }
    const data = {};
    if (actual.creditos !== m.creditos) data.creditos = m.creditos;
    if (actual.trimestreSugerido !== m.trimestre) data.trimestreSugerido = m.trimestre;
    if (actual.estado !== m.estado) {
      data.estado = m.estado;
      if (m.estado !== 'Aprobada') data.calificacion = null;
    }
    if (Object.keys(data).length) {
      await prisma.asignaturaPensum.update({ where: { clave: m.clave }, data });
      console.log(`~ ${m.clave}: ${Object.entries(data).map(([k, v]) => `${k}=${v}`).join(', ')}`);
      cambios++;
    }
  }
  const clavesActuales = new Set(PENSUM_ACTUAL.map(m => m.clave));
  const sobrantes = (await prisma.asignaturaPensum.findMany({ select: { clave: true } }))
    .map(x => x.clave).filter(c => !clavesActuales.has(c));
  if (sobrantes.length) console.warn(`! Materias en la base que no están en el pensum actual (no se tocan): ${sobrantes.join(', ')}`);
  console.log(`~ Pensum sincronizado (${cambios} cambios)`);

  const NOMBRES_ELECTIVAS = {
    CBA1X3: 'VIDA EN EL MEDIO AMBIENTE (ELECTIVAS) · CBA103 Fundamentos de Gestión Ambiental',
    EAA1X1: 'ELECTIVAS DE AREAS ACADEMICAS I · ASM104 Vida Saludable',
    EAA1X2: 'ELECTIVAS DE AREAS ACADEMICAS II · ASM107 Nutrición Saludable',
    EAA1X3: 'ELECTIVAS DE AREAS ACADEMICAS III · CBA106 Ambiente y Cultura',
    EAA1X4: 'ELECTIVAS DE AREAS ACADEMICAS IV · NEG101 Inteligencia Financiera',
    ISE2E1: 'IMPACTO SOCIAL (ELECTIVA) · ING237 Impacto Social (ING)',
    EEE2X1: 'ELECTIVAS DE ESTUDIOS ESPECIALIZADOS I · Convalidada (ITLA CBG 210 Probabilidad y Estadística)',
    EEE2X2: 'ELECTIVAS DE ESTUDIOS ESPECIALIZADOS II · CSG210 Derechos Humanos',
    EEP3X1: 'ELECTIVAS DE ESTUDIOS PROFESIONALIZANTES I · Convalidada (ITLA TDS 005 Diseño Centrado en el Usuario, 0 créditos)',
    EEP3X2: 'ELECTIVAS DE ESTUDIOS PROFESIONALIZANTES II · ADM337 Derecho Comercial',
    EEP3X3: 'ELECTIVAS DE ESTUDIOS PROFESIONALIZANTES III · INS369 Inteligencia de Negocios',
  };
  for (const [clave, nombre] of Object.entries(NOMBRES_ELECTIVAS)) {
    await prisma.asignaturaPensum.updateMany({ where: { clave }, data: { nombre } });
  }
  console.log('~ Nombres de electivas actualizados');

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
