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

  const cursando = ['CBM208', 'IDS328', 'IDS328L'];
  const pendientes = ['CBM203', 'CBM305', 'INS380', 'INS380L', 'IDS330', 'IDS330L', 'IDS3X5'];

  // Para llegar a un índice de ~3.60, asignaremos un 60% de A y 40% de B
  let aCount = 0;
  
  for (const m of pensumOficial) {
    let estado = "Aprobada";
    let calificacion = "A";

    if (cursando.includes(m.clave)) {
      estado = "Cursando";
      calificacion = null;
    } else if (pendientes.includes(m.clave)) {
      estado = "Pendiente";
      calificacion = null;
    } else {
      // Garantizar que la mayoría de las aprobadas tengan A y B para simular 3.60
      // IDS345L obligatoriamente aprobada
      if (m.clave === 'IDS345L') {
        calificacion = 'A';
      } else {
        calificacion = aCount % 3 !== 0 ? 'A' : 'B'; // 2/3 son A, 1/3 son B (Aprox 3.66 index)
        aCount++;
      }
    }

    await prisma.asignaturaPensum.upsert({
      where: { clave: m.clave },
      update: { 
        nombre: m.nombre, 
        creditos: m.creditos, 
        trimestreSugerido: m.trimestreSugerido,
        estado: estado,
        calificacion: calificacion
      },
      create: {
        clave: m.clave,
        nombre: m.nombre,
        creditos: m.creditos,
        trimestreSugerido: m.trimestreSugerido,
        estado: estado,
        calificacion: calificacion
      }
    });
  }

  console.log(`¡Éxito! Pensum de ${pensumOficial.length} materias cargado correctamente.`);

  console.log("3. Limpiando historial y volantes previos...");
  await prisma.horarioAsignatura.deleteMany({});
  await prisma.volanteSeleccion.deleteMany({});
  await prisma.asignaturaCursada.deleteMany({});
  await prisma.trimestre.deleteMany({});

  console.log("4. Creando historial de trimestres...");
  // Trimestre 1: 4 materias, 14 creditos, gpa 4.00
  await prisma.trimestre.create({
    data: {
      periodo: "Noviembre - Enero",
      anio: 2025,
      indiceTrimestral: 4.00,
      indiceAcumulado: 4.00,
      asignaturas: {
        create: [
          { claveMateria: "AHC109", calificacion: "A", puntos: 16 }, // 4 cr * 4
          { claveMateria: "CBM101", calificacion: "A", puntos: 20 }, // 5 cr * 4
          { claveMateria: "IDS323", calificacion: "A", puntos: 16 }, // 4 cr * 4
          { claveMateria: "IDS323L", calificacion: "A", puntos: 4 }  // 1 cr * 4
        ]
      }
    }
  });

  // Trimestre 2: 1 materia, 5 creditos, gpa 2.00
  await prisma.trimestre.create({
    data: {
      periodo: "Febrero - Abril",
      anio: 2026,
      indiceTrimestral: 2.00,
      indiceAcumulado: 3.60,
      asignaturas: {
        create: [
          { claveMateria: "CBM102", calificacion: "C", puntos: 10 } // 5 cr * 2 = 10
        ]
      }
    }
  });

  console.log("5. Creando Volante de Selección actual...");
  await prisma.volanteSeleccion.create({
    data: {
      periodo: "Mayo - Julio 2026",
      activo: true,
      horarios: {
        create: [
          {
            claveMateria: "CBM208", // Álgebra Lineal
            profesor: "Eugenio Martinez",
            dia: "Lunes y Miércoles",
            horas: "10:00 AM - 12:00 PM",
            aula: "Aula GC-313"
          },
          {
            claveMateria: "IDS328", // Administración de Configuración
            profesor: "Juan Perez",
            dia: "Martes",
            horas: "06:00 PM - 10:00 PM",
            aula: "Aula VIRTUAL"
          },
          {
            claveMateria: "IDS328L", // Lab. de Admin. Configuración
            profesor: "Maria Fernandez",
            dia: "Jueves",
            horas: "04:00 PM - 06:00 PM",
            aula: "Lab FD-411"
          }
        ]
      }
    }
  });

  console.log("¡Éxito! Data transaccional (Trimestres y Volante) cargada correctamente.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });