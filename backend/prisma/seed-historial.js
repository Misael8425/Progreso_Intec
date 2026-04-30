const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const trimestreService = require('../src/services/trimestre.service');

const electivasFaltantes = [
  { clave: "ASM104", nombre: "VIDA SALUDABLE", creditos: 2, trimestreSugerido: 0 },
  { clave: "ASM107", nombre: "NUTRICION SALUDABLE", creditos: 2, trimestreSugerido: 0 },
  { clave: "CBA106", nombre: "AMBIENTE Y CULTURA", creditos: 2, trimestreSugerido: 0 },
  { clave: "CSG210", nombre: "DERECHOS HUMANOS", creditos: 4, trimestreSugerido: 0 },
  { clave: "ING237", nombre: "IMPACTO SOCIAL", creditos: 4, trimestreSugerido: 0 },
  { clave: "CBA103", nombre: "FUNDAMENTO DE GESTION AMBIENTAL", creditos: 2, trimestreSugerido: 0 },
  { clave: "NEG101", nombre: "INTELIGENCIA FINANCIERA", creditos: 2, trimestreSugerido: 0 },
  { clave: "ADM337", nombre: "DERECHO COMERCIAL", creditos: 4, trimestreSugerido: 0 }
];

const historialCompleto = [
  { periodo: "Agosto - Octubre", anio: 2022, asignaturas: [{ claveMateria: "CBF210", calificacion: "CO" }, { claveMateria: "CBF210L", calificacion: "CO" }, { claveMateria: "CBM101", calificacion: "CO" }, { claveMateria: "CBM102", calificacion: "CO" }, { claveMateria: "CSH112", calificacion: "CO" }, { claveMateria: "CSS102", calificacion: "CO" }, { claveMateria: "EEE2X1", calificacion: "CO" }, { claveMateria: "EEP3X1", calificacion: "CO" }, { claveMateria: "IDS202", calificacion: "CO" }, { claveMateria: "IDS202L", calificacion: "CO" }, { claveMateria: "IDS340", calificacion: "CO" }, { claveMateria: "IDS340L", calificacion: "CO" }, { claveMateria: "IDS343", calificacion: "CO" }, { claveMateria: "IDS343L", calificacion: "CO" }, { claveMateria: "ING102", calificacion: "CO" }, { claveMateria: "ING102L", calificacion: "CO" }, { claveMateria: "SHI103", calificacion: "EI" }, { claveMateria: "SHI104", calificacion: "EI" }, { claveMateria: "SHI105", calificacion: "EI" }, { claveMateria: "AHC109", calificacion: "B" }, { claveMateria: "AHQ101", calificacion: "B" }, { claveMateria: "IDS207", calificacion: "A" }] },
  { periodo: "Noviembre - Enero", anio: 2022, asignaturas: [{ claveMateria: "AHC110", calificacion: "A" }, { claveMateria: "AHO102", calificacion: "A" }, { claveMateria: "ASM104", calificacion: "B+" }, { claveMateria: "ASM107", calificacion: "C" }, { claveMateria: "CBA106", calificacion: "A" }, { claveMateria: "CBM201", calificacion: "C" }, { claveMateria: "IDS323", calificacion: "A" }, { claveMateria: "IDS323L", calificacion: "A" }, { claveMateria: "ING228", calificacion: "A" }, { claveMateria: "NEG101", calificacion: "A" }] },
  { periodo: "Febrero - Abril", anio: 2023, asignaturas: [{ claveMateria: "IDS208", calificacion: "A" }, { claveMateria: "IDS341", calificacion: "A" }, { claveMateria: "IDS341L", calificacion: "A" }, { claveMateria: "IDS342", calificacion: "A" }, { claveMateria: "SHI106", calificacion: "A" }] },
  { periodo: "Mayo - Julio", anio: 2023, asignaturas: [{ claveMateria: "CBF211", calificacion: "R" }, { claveMateria: "CBF211L", calificacion: "B" }, { claveMateria: "CSH105", calificacion: "A" }, { claveMateria: "CSH113", calificacion: "A" }, { claveMateria: "IDS324", calificacion: "A" }, { claveMateria: "IDS324L", calificacion: "A" }, { claveMateria: "SHI107", calificacion: "A" }] },
  { periodo: "Agosto - Octubre", anio: 2023, asignaturas: [{ claveMateria: "IDS329", calificacion: "A" }, { claveMateria: "IDS329L", calificacion: "A" }, { claveMateria: "IDS344", calificacion: "A" }, { claveMateria: "IDS344L", calificacion: "A" }, { claveMateria: "IDS346", calificacion: "A" }, { claveMateria: "INS377", calificacion: "B+" }, { claveMateria: "INS377L", calificacion: "B" }] },
  { periodo: "Noviembre - Enero", anio: 2023, asignaturas: [{ claveMateria: "CBF211", calificacion: "A" }, { claveMateria: "IDS345", calificacion: "A" }, { claveMateria: "IDS350", calificacion: "A" }, { claveMateria: "ING214", calificacion: "A" }, { claveMateria: "ING237", calificacion: "A" }] },
  { periodo: "Febrero - Abril", anio: 2024, asignaturas: [{ claveMateria: "CBA103", calificacion: "A" }, { claveMateria: "CBM202", calificacion: "D" }, { claveMateria: "CSG210", calificacion: "A" }, { claveMateria: "IDS335", calificacion: "A" }, { claveMateria: "IDS347", calificacion: "A" }, { claveMateria: "IDS347L", calificacion: "A" }, { claveMateria: "ING231", calificacion: "A" }] },
  { periodo: "Mayo - Julio", anio: 2024, asignaturas: [{ claveMateria: "IDS303", calificacion: "A" }, { claveMateria: "IDS309", calificacion: "A" }, { claveMateria: "IDS325", calificacion: "A" }, { claveMateria: "IDS325L", calificacion: "A" }, { claveMateria: "IEC208", calificacion: "A" }, { claveMateria: "IEC208L", calificacion: "A" }, { claveMateria: "ING230", calificacion: "B" }, { claveMateria: "SHI108", calificacion: "A" }] },
  { periodo: "Agosto - Octubre", anio: 2024, asignaturas: [{ claveMateria: "ADM337", calificacion: "A" }, { claveMateria: "CBM202", calificacion: "F" }, { claveMateria: "IDS326", calificacion: "A" }, { claveMateria: "IDS326L", calificacion: "A" }, { claveMateria: "ING235", calificacion: "A" }, { claveMateria: "ING235L", calificacion: "A" }] },
  { periodo: "Noviembre - Enero", anio: 2024, asignaturas: [{ claveMateria: "IDS311", calificacion: "A" }, { claveMateria: "IDS348", calificacion: "A" }, { claveMateria: "IDS348L", calificacion: "A" }, { claveMateria: "IDS353", calificacion: "A" }, { claveMateria: "INS371", calificacion: "A" }, { claveMateria: "INS371L", calificacion: "A" }] },
  { periodo: "Febrero - Abril", anio: 2025, asignaturas: [{ claveMateria: "CON213", calificacion: "A" }, { claveMateria: "IDS349", calificacion: "A" }, { claveMateria: "IDS349L", calificacion: "A" }, { claveMateria: "IDS351", calificacion: "A" }, { claveMateria: "IDS352", calificacion: "A" }, { claveMateria: "IDS356", calificacion: "A" }] },
  { periodo: "Mayo - Julio", anio: 2025, asignaturas: [{ claveMateria: "CBM202", calificacion: "D" }, { claveMateria: "IDS322", calificacion: "A" }, { claveMateria: "IDS334", calificacion: "A" }, { claveMateria: "IDS355", calificacion: "A" }, { claveMateria: "INS373", calificacion: "A" }, { claveMateria: "INS373L", calificacion: "A" }] },
  { periodo: "Agosto - Octubre", anio: 2025, asignaturas: [{ claveMateria: "ECO322", calificacion: "A" }, { claveMateria: "ICS202", calificacion: "A" }, { claveMateria: "ICS202L", calificacion: "A" }, { claveMateria: "IDS339", calificacion: "A" }, { claveMateria: "IDS357", calificacion: "A" }, { claveMateria: "INS369", calificacion: "A" }] },
  { periodo: "Noviembre - Enero", anio: 2025, asignaturas: [{ claveMateria: "ADM315", calificacion: "A" }, { claveMateria: "CBM202", calificacion: "R" }, { claveMateria: "ICS320", calificacion: "A+" }, { claveMateria: "IDS354", calificacion: "A+" }] },
  { periodo: "Febrero - Abril", anio: 2026, asignaturas: [{ claveMateria: "CBM202", calificacion: "C" }] },
  { periodo: "Mayo - Julio", anio: 2026, asignaturas: [{ claveMateria: "CBM208", calificacion: null }, { claveMateria: "IDS328", calificacion: null }, { claveMateria: "IDS328L", calificacion: null }] }
];

async function main() {
  console.log(`Inyectando electivas faltantes (${electivasFaltantes.length})...`);
  for (const electiva of electivasFaltantes) {
    await prisma.asignaturaPensum.upsert({
      where: { clave: electiva.clave },
      update: {},
      create: electiva
    });
  }

  // Verificar e inyectar todas las materias del historial en el pensum si no existen
  const clavesFaltantes = new Set();
  for (const trimestre of historialCompleto) {
    for (const asig of trimestre.asignaturas) {
      const existe = await prisma.asignaturaPensum.findUnique({
        where: { clave: asig.claveMateria }
      });
      if (!existe) {
        clavesFaltantes.add(asig.claveMateria);
        
        // Inferencia aproximada de créditos según nomenclaturas de INTEC
        let creditosInferidos = 4;
        if (asig.claveMateria.endsWith('L')) creditosInferidos = 1; // Laboratorios
        else if (asig.claveMateria.startsWith('SHI')) creditosInferidos = 0; // Inglés
        else if (asig.claveMateria.startsWith('CBM')) creditosInferidos = 5; // Matemáticas

        await prisma.asignaturaPensum.create({
          data: {
            clave: asig.claveMateria,
            nombre: `MATERIA AUTOGENERADA (${asig.claveMateria})`,
            creditos: creditosInferidos,
            trimestreSugerido: 0
          }
        });
      }
    }
  }

  if (clavesFaltantes.size > 0) {
    console.log(`Se autogeneraron ${clavesFaltantes.size} materias faltantes en el pensum para permitir el historial.`);
  }

  console.log('Limpiando historial anterior de trimestres para evitar duplicados...');
  await prisma.asignaturaCursada.deleteMany();
  await prisma.trimestre.deleteMany();

  console.log(`Iniciando inyección de ${historialCompleto.length} trimestres...`);
  for (let i = 0; i < historialCompleto.length; i++) {
    const trimestreData = historialCompleto[i];
    console.log(`Procesando [${i+1}/${historialCompleto.length}] ${trimestreData.periodo} ${trimestreData.anio}...`);
    try {
      await trimestreService.registrarTrimestre(trimestreData);
    } catch (e) {
      console.error(`Error en el trimestre ${trimestreData.periodo} ${trimestreData.anio}:`, e.message);
      process.exit(1);
    }
  }

  console.log('¡Historial inyectado correctamente! Se calcularon los índices.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
