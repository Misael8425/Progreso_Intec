const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("1. Purgando materias basura del frontend...");
  // Al enviar todo a 0, desaparecen de tu cuadrícula de 1 al 14.
  await prisma.asignaturaPensum.updateMany({
    data: { trimestreSugerido: 0 }
  });

  console.log("2. Sobrescribiendo con el Pensum IDS-2020 Oficial...");
  
  const pensumOficial = [
    // Trimestre 1 (21 CR)
    { clave: "AHC109", nombre: "REDACCION", creditos: 4, trimestreSugerido: 1 },
    { clave: "AHO102", nombre: "ORIENTACION ACADEMICA E INSTITUCIONAL", creditos: 0, trimestreSugerido: 1 },
    { clave: "CBA1X3", nombre: "VIDA EN EL MEDIO AMBIENTE (ELECTIVAS)", creditos: 2, trimestreSugerido: 1 },
    { clave: "CBM101", nombre: "ALGEBRA Y GEOMETRIA ANALITICA", creditos: 5, trimestreSugerido: 1 },
    { clave: "CSH112", nombre: "CIUDADANIA Y ETICA", creditos: 2, trimestreSugerido: 1 },
    { clave: "EAA1X1", nombre: "ELECTIVAS DE AREAS ACADEMICAS I", creditos: 2, trimestreSugerido: 1 },
    { clave: "EAA1X2", nombre: "ELECTIVAS DE AREAS ACADEMICAS II", creditos: 2, trimestreSugerido: 1 },
    { clave: "EAA1X3", nombre: "ELECTIVAS DE AREAS ACADEMICAS III", creditos: 2, trimestreSugerido: 1 },
    { clave: "IDS207", nombre: "INTRODUCCION A LA INGENIERIA DE SOFTWARE", creditos: 2, trimestreSugerido: 1 },
    { clave: "SHI103", nombre: "INGLES 01 (BASICO I)", creditos: 0, trimestreSugerido: 1 },

    // Trimestre 2 (20 CR)
    { clave: "AHC110", nombre: "ARGUMENTACIÓN LINGÜÍSTICA", creditos: 4, trimestreSugerido: 2 },
    { clave: "CBM102", nombre: "CALCULO DIFERENCIAL", creditos: 5, trimestreSugerido: 2 },
    { clave: "CSS102", nombre: "SER HUMANO Y SOCIEDAD: TEMAS SOCIALES CONTEMPORANEOS", creditos: 2, trimestreSugerido: 2 },
    { clave: "EAA1X4", nombre: "ELECTIVAS DE AREAS ACADEMICAS IV", creditos: 2, trimestreSugerido: 2 },
    { clave: "IDS323", nombre: "TECNICAS FUNDAMENTALES DE INGENIERIA DE SOFTWARE", creditos: 4, trimestreSugerido: 2 },
    { clave: "IDS323L", nombre: "LABORATORIO TECNICAS FUNDAMENTALES DE INGENIERIA DE SOFTWARE", creditos: 1, trimestreSugerido: 2 },
    { clave: "ING102", nombre: "INTRODUCCION A LA PROGRAMACION", creditos: 2, trimestreSugerido: 2 },
    { clave: "ING102L", nombre: "LABORATORIO DE INTRODUCCION A LA PROGRAMACION", creditos: 0, trimestreSugerido: 2 },
    { clave: "SHI104", nombre: "INGLES 02 (BASICO II)", creditos: 0, trimestreSugerido: 2 },

    // Trimestre 3 (20 CR)
    { clave: "CBF210", nombre: "FISICA MECANICA I", creditos: 4, trimestreSugerido: 3 },
    { clave: "CBF210L", nombre: "LABORATORIO DE FISICA MECANICA I", creditos: 1, trimestreSugerido: 3 },
    { clave: "CBM201", nombre: "CALCULO INTEGRAL", creditos: 5, trimestreSugerido: 3 },
    { clave: "IDS202", nombre: "TECNOLOGIA DE OBJETOS", creditos: 4, trimestreSugerido: 3 },
    { clave: "IDS202L", nombre: "LABORATORIO TECNOLOGIA DE OBJETOS", creditos: 1, trimestreSugerido: 3 },
    { clave: "IDS340", nombre: "DESARROLLO DE SOFTWARE I", creditos: 3, trimestreSugerido: 3 },
    { clave: "IDS340L", nombre: "LABORATORIO DE DESARROLLO DE SOFTWARE I", creditos: 1, trimestreSugerido: 3 },
    { clave: "ING228", nombre: "HOJA DE CALCULO PARA INGENIEROS", creditos: 1, trimestreSugerido: 3 },
    { clave: "SHI105", nombre: "INGLES 03 (INTERMEDIO I)", creditos: 0, trimestreSugerido: 3 },

    // Trimestre 4 (20 CR)
    { clave: "AHQ101", nombre: "QUEHACER CIENTIFICO", creditos: 4, trimestreSugerido: 4 },
    { clave: "CBF211", nombre: "FISICA MECANICA II", creditos: 4, trimestreSugerido: 4 },
    { clave: "CBF211L", nombre: "LABORATORIO DE FISICA MECANICA II", creditos: 1, trimestreSugerido: 4 },
    { clave: "CBM202", nombre: "CALCULO VECTORIAL", creditos: 5, trimestreSugerido: 4 },
    { clave: "CSH113", nombre: "PENSAMIENTO CREATIVO", creditos: 2, trimestreSugerido: 4 },
    { clave: "IDS341", nombre: "DESARROLLO DE SOFTWARE II", creditos: 3, trimestreSugerido: 4 },
    { clave: "IDS341L", nombre: "LABORATORIO DE DESARROLLO DE SOFTWARE II", creditos: 1, trimestreSugerido: 4 },
    { clave: "IDS342", nombre: "CONSEJERIA PROFESIONAL INGENIERIA DE SOFTWARE I", creditos: 0, trimestreSugerido: 4 },
    { clave: "SHI106", nombre: "INGLES 04 (INTERMEDIO II)", creditos: 0, trimestreSugerido: 4 },

    // Trimestre 5 (22 CR)
    { clave: "CBM208", nombre: "ALGEBRA LINEAL", creditos: 5, trimestreSugerido: 5 },
    { clave: "IDS208", nombre: "TEAM BUILDING", creditos: 4, trimestreSugerido: 5 },
    { clave: "IDS311", nombre: "PROCESO DE SOFTWARE", creditos: 4, trimestreSugerido: 5 },
    { clave: "IDS324", nombre: "INGENIERIA DE REQUERIMIENTOS DE SOFTWARE", creditos: 4, trimestreSugerido: 5 },
    { clave: "IDS324L", nombre: "LABORATORIO INGENIERIA DE REQUERIMIENTOS DE SOFTWARE", creditos: 1, trimestreSugerido: 5 },
    { clave: "IDS343", nombre: "ESTRUCTURAS DE DATOS Y ALGORITMOS I", creditos: 3, trimestreSugerido: 5 },
    { clave: "IDS343L", nombre: "LABORATORIO ESTRUCTURAS DE DATOS Y ALGORITMOS I", creditos: 1, trimestreSugerido: 5 },
    { clave: "SHI107", nombre: "INGLES 05 (AVANZADO I)", creditos: 0, trimestreSugerido: 5 },

    // Trimestre 6 (20 CR)
    { clave: "CBM203", nombre: "ECUACIONES DIFERENCIALES", creditos: 5, trimestreSugerido: 6 },
    { clave: "CSH105", nombre: "PROYECTO INTEGRADOR DE ESTUDIOS GENERALES", creditos: 2, trimestreSugerido: 6 },
    { clave: "IDS344", nombre: "ESTRUCTURAS DE DATOS Y ALGORITMOS II", creditos: 3, trimestreSugerido: 6 },
    { clave: "IDS344L", nombre: "LABORATORIO ESTRUCTURAS DE DATOS Y ALGORITMOS II", creditos: 1, trimestreSugerido: 6 },
    { clave: "IEC208", nombre: "FUNDAMENTOS ELECTRÓNICA DIGITAL", creditos: 3, trimestreSugerido: 6 },
    { clave: "IEC208L", nombre: "LABORATORIO FUNDAMENTOS ELECTRÓNICA DIGITAL", creditos: 1, trimestreSugerido: 6 },
    { clave: "INS377", nombre: "BASES DE DATOS I", creditos: 4, trimestreSugerido: 6 },
    { clave: "INS377L", nombre: "LABORATORIO BASES DE DATOS I", creditos: 1, trimestreSugerido: 6 },
    { clave: "SHI108", nombre: "INGLES 06 (AVANZADO II)", creditos: 0, trimestreSugerido: 6 },

    // Trimestre 7 (21 CR)
    { clave: "CBM305", nombre: "MATEMATICA DISCRETA I", creditos: 4, trimestreSugerido: 7 },
    { clave: "IDS329", nombre: "INGENIERIA DE FACTORES HUMANOS", creditos: 4, trimestreSugerido: 7 },
    { clave: "IDS329L", nombre: "LABORATORIO INGENIERIA DE FACTORES HUMANOS", creditos: 1, trimestreSugerido: 7 },
    { clave: "IDS345", nombre: "DESARROLLO DE SOFTWARE III", creditos: 3, trimestreSugerido: 7 },
    { clave: "IDS345L", nombre: "LABORATORIO DE DESARROLLO DE SOFTWARE III", creditos: 1, trimestreSugerido: 7 },
    { clave: "IDS346", nombre: "MODELOS Y METODOS DE LA INGENIERIA DE SOFTWARE", creditos: 3, trimestreSugerido: 7 },
    { clave: "INS380", nombre: "BASES DE DATOS II", creditos: 4, trimestreSugerido: 7 },
    { clave: "INS380L", nombre: "LABORATORIO DE BASES DE DATOS II", creditos: 1, trimestreSugerido: 7 },

    // Trimestre 8 (22 CR)
    { clave: "EEE2X1", nombre: "ELECTIVAS DE ESTUDIOS ESPECIALIZADOS I", creditos: 0, trimestreSugerido: 8 },
    { clave: "ICS202", nombre: "ALGORITMOS MALICIOSOS", creditos: 4, trimestreSugerido: 8 },
    { clave: "ICS202L", nombre: "LABORATORIO DE ALGORITMOS MALICIOSOS", creditos: 1, trimestreSugerido: 8 },
    { clave: "IDS325", nombre: "ASEGURAMIENTO DE LA CALIDAD DEL SOFTWARE", creditos: 4, trimestreSugerido: 8 },
    { clave: "IDS325L", nombre: "LABORATORIO ASEGURAMIENTO DE LA CALIDAD DEL SOFTWARE", creditos: 1, trimestreSugerido: 8 },
    { clave: "IDS335", nombre: "DISEÑO DE SOFTWARE", creditos: 4, trimestreSugerido: 8 },
    { clave: "IDS347", nombre: "TENDENCIAS EN DESARROLLO DE SOFTWARE", creditos: 3, trimestreSugerido: 8 },
    { clave: "IDS347L", nombre: "LABORATORIO TENDENCIAS EN DESARROLLO DE SOFTWARE", creditos: 1, trimestreSugerido: 8 },
    { clave: "ING214", nombre: "ANALISIS DE DATOS EN INGENIERIA", creditos: 4, trimestreSugerido: 8 },
    { clave: "ISE2X1", nombre: "ELECTIVA DE INNOVACION SOCIAL I", creditos: 0, trimestreSugerido: 8 },

    // Trimestre 9 (19 CR)
    { clave: "CON213", nombre: "FUNDAMENTOS DE CONTABILIDAD", creditos: 2, trimestreSugerido: 9 },
    { clave: "IDS303", nombre: "PRACTICA PROFESIONAL DE INGENIERIA DE SOFTWARE", creditos: 2, trimestreSugerido: 9 },
    { clave: "IDS309", nombre: "ARQUITECTURA DE SOFTWARE", creditos: 4, trimestreSugerido: 9 },
    { clave: "IDS348", nombre: "DESARROLLO DE APLICACIONES WEB", creditos: 3, trimestreSugerido: 9 },
    { clave: "IDS348L", nombre: "LABORATORIO DESARROLLO DE APLICACIONES WEB", creditos: 1, trimestreSugerido: 9 },
    { clave: "ING230", nombre: "INGENIERIA ECONOMICA", creditos: 4, trimestreSugerido: 9 },
    { clave: "ING231", nombre: "EXPERIMENTACION EN INGENIERIA", creditos: 3, trimestreSugerido: 9 },

    // Trimestre 10 (18 CR)
    { clave: "IDS326", nombre: "CONSTRUCCION DE SOFTWARE", creditos: 4, trimestreSugerido: 10 },
    { clave: "IDS326L", nombre: "LABORATORIO CONSTRUCCION DE SOFTWARE", creditos: 1, trimestreSugerido: 10 },
    { clave: "IDS349", nombre: "DESARROLLO DE APLICACIONES MOBILES", creditos: 3, trimestreSugerido: 10 },
    { clave: "IDS349L", nombre: "LABORATORIO DESARROLLO DE APLICACIONES MOBILES", creditos: 1, trimestreSugerido: 10 },
    { clave: "ING235", nombre: "FORMULACION Y GESTION DE PROYECTOS TECNOLOGICOS", creditos: 4, trimestreSugerido: 10 },
    { clave: "ING235L", nombre: "LABORATORIO FORMULACION Y GESTION DE PROYECTOS TECNOLOGICOS", creditos: 1, trimestreSugerido: 10 },
    { clave: "INS371", nombre: "ARQUITECTURA DEL COMPUTADOR", creditos: 3, trimestreSugerido: 10 },
    { clave: "INS371L", nombre: "LABORATORIO ARQUITECTURA COMPUTADOR", creditos: 1, trimestreSugerido: 10 },

    // Trimestre 11 (20 CR)
    { clave: "ECO322", nombre: "ECONOMIA DE EMPRESA", creditos: 4, trimestreSugerido: 11 },
    { clave: "IDS328", nombre: "ADMINISTRACION DE CONFIGURACION", creditos: 4, trimestreSugerido: 11 },
    { clave: "IDS328L", nombre: "LABORATORIO DE ADMINISTRACION DE CONFIGURACION", creditos: 1, trimestreSugerido: 11 },
    { clave: "IDS330", nombre: "INTELIGENCIA ARTIFICIAL", creditos: 3, trimestreSugerido: 11 },
    { clave: "IDS330L", nombre: "LABORATORIO INTELIGENCIA ARTIFICIAL", creditos: 1, trimestreSugerido: 11 },
    { clave: "IDS350", nombre: "CONSEJERIA PROFESIONAL INGENIERIA DE SOFTWARE II", creditos: 0, trimestreSugerido: 11 },
    { clave: "IDS351", nombre: "PRUEBAS DE SOFTWARE", creditos: 2, trimestreSugerido: 11 },
    { clave: "INS373", nombre: "SISTEMAS OPERATIVOS", creditos: 4, trimestreSugerido: 11 },
    { clave: "INS373L", nombre: "LABORATORIO SISTEMAS OPERATIVOS", creditos: 1, trimestreSugerido: 11 },

    // Trimestre 12 (18 CR)
    { clave: "ADM315", nombre: "ADMINISTRACION Y GESTION EMPRESARIAL", creditos: 4, trimestreSugerido: 12 },
    { clave: "ICS320", nombre: "FUNDAMENTOS DE CIBERSEGURIDAD", creditos: 2, trimestreSugerido: 12 },
    { clave: "IDS339", nombre: "DEVOPS Y DEVSECOPS", creditos: 3, trimestreSugerido: 12 },
    { clave: "IDS352", nombre: "ANTEPROYECTO DE GRADO", creditos: 4, trimestreSugerido: 12 },
    { clave: "IDS353", nombre: "PASANTIA PROFESIONAL I", creditos: 2, trimestreSugerido: 12 },
    { clave: "IDS354", nombre: "GESTION DE LA INGENIERIA DE SOFTWARE", creditos: 3, trimestreSugerido: 12 },

    // Trimestre 13 (10 CR)
    { clave: "EEE2X2", nombre: "ELECTIVAS DE ESTUDIOS ESPECIALIZADOS II", creditos: 0, trimestreSugerido: 13 },
    { clave: "EFP3X1", nombre: "ELECTIVA PROFESIONAL", creditos: 0, trimestreSugerido: 13 },
    { clave: "IDS322", nombre: "MANTENIMIENTO DE SOFTWARE", creditos: 4, trimestreSugerido: 13 },
    { clave: "IDS355", nombre: "PROYECTO DE GRADO", creditos: 4, trimestreSugerido: 13 },
    { clave: "IDS356", nombre: "PASANTIA PROFESIONAL II", creditos: 2, trimestreSugerido: 13 },
    { clave: "IDS3X5", nombre: "CERTIFICACION PROFESIONAL", creditos: 0, trimestreSugerido: 13 },
    { clave: "ISE2X2", nombre: "ELECTIVA DE INNOVACION SOCIAL II", creditos: 0, trimestreSugerido: 13 },

    // Trimestre 14 (8 CR)
    { clave: "EFP3X2", nombre: "ELECTIVA PROFESIONAL", creditos: 0, trimestreSugerido: 14 },
    { clave: "EFP3X3", nombre: "ELECTIVA PROFESIONAL", creditos: 0, trimestreSugerido: 14 },
    { clave: "IDS334", nombre: "SEMINARIO DE TECNOLOGIA E INGENIERIA DE SOFTWARE", creditos: 4, trimestreSugerido: 14 },
    { clave: "IDS357", nombre: "PROYECTO FINAL DE GRADO", creditos: 4, trimestreSugerido: 14 }
  ];

  for (const m of pensumOficial) {
    await prisma.asignaturaPensum.upsert({
      where: { clave: m.clave },
      // ¡EL FIX CLAVE ESTÁ AQUÍ! Forzamos actualizar NOMBRE y CREDITOS también.
      update: { 
        nombre: m.nombre, 
        creditos: m.creditos, 
        trimestreSugerido: m.trimestreSugerido 
      },
      create: {
        clave: m.clave,
        nombre: m.nombre,
        creditos: m.creditos,
        trimestreSugerido: m.trimestreSugerido
      }
    });
  }

  console.log("¡Éxito! Pensum restaurado, corregido y limpio.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());