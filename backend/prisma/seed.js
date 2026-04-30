const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. LIMPIAR TODO
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("1. Limpiando base de datos...");
  await prisma.horarioAsignatura.deleteMany({});
  await prisma.volanteSeleccion.deleteMany({});
  await prisma.asignaturaCursada.deleteMany({});
  await prisma.trimestre.deleteMany({});
  await prisma.asignaturaPensum.deleteMany({});

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. PENSUM OFICIAL IDS-2020
  //    Fuente: PDF pensum oficial + Récord Según Pensum
  //    NOTA: Las electivas genéricas (EAA1X1-4, CBA1X3, EEE2X1, etc.) usan la
  //    clave del pensum, no la materia real cursada. El mapeo real→pensum está
  //    reflejado en el historial.
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("2. Cargando Pensum IDS-2020 Oficial...");

  const pensumOficial = [
    // ── Trimestre 1 (21 CR) ──────────────────────────────────────────────────
    { clave: "AHC109",  nombre: "REDACCION",                                                    creditos: 4, trimestreSugerido: 1  },
    { clave: "AHO102",  nombre: "ORIENTACION ACADEMICA E INSTITUCIONAL",                        creditos: 0, trimestreSugerido: 1  },
    { clave: "CBA1X3",  nombre: "VIDA EN EL MEDIO AMBIENTE (ELECTIVAS)",                        creditos: 2, trimestreSugerido: 1  },
    { clave: "CBM101",  nombre: "ALGEBRA Y GEOMETRIA ANALITICA",                                creditos: 5, trimestreSugerido: 1  },
    { clave: "CSH112",  nombre: "CIUDADANIA Y ETICA",                                           creditos: 2, trimestreSugerido: 1  },
    { clave: "EAA1X1",  nombre: "ELECTIVAS DE AREAS ACADEMICAS I",                             creditos: 2, trimestreSugerido: 1  },
    { clave: "EAA1X2",  nombre: "ELECTIVAS DE AREAS ACADEMICAS II",                            creditos: 2, trimestreSugerido: 1  },
    { clave: "EAA1X3",  nombre: "ELECTIVAS DE AREAS ACADEMICAS III",                           creditos: 2, trimestreSugerido: 1  },
    { clave: "IDS207",  nombre: "INTRODUCCION A LA INGENIERIA DE SOFTWARE",                    creditos: 2, trimestreSugerido: 1  },
    { clave: "SHI103",  nombre: "INGLES 01 (BASICO I)",                                        creditos: 0, trimestreSugerido: 1  },

    // ── Trimestre 2 (20 CR) ──────────────────────────────────────────────────
    { clave: "AHC110",  nombre: "ARGUMENTACION LINGUISTICA",                                   creditos: 4, trimestreSugerido: 2  },
    { clave: "CBM102",  nombre: "CALCULO DIFERENCIAL",                                         creditos: 5, trimestreSugerido: 2  },
    { clave: "CSS102",  nombre: "SER HUMANO Y SOCIEDAD: TEMAS SOCIALES CONTEMPORANEOS",        creditos: 2, trimestreSugerido: 2  },
    { clave: "EAA1X4",  nombre: "ELECTIVAS DE AREAS ACADEMICAS IV",                            creditos: 2, trimestreSugerido: 2  },
    { clave: "IDS323",  nombre: "TECNICAS FUNDAMENTALES DE INGENIERIA DE SOFTWARE",            creditos: 4, trimestreSugerido: 2  },
    { clave: "IDS323L", nombre: "LABORATORIO TECNICAS FUNDAMENTALES DE INGENIERIA DE SOFTWARE",creditos: 1, trimestreSugerido: 2  },
    { clave: "ING102",  nombre: "INTRODUCCION A LA PROGRAMACION",                              creditos: 2, trimestreSugerido: 2  },
    { clave: "ING102L", nombre: "LABORATORIO DE INTRODUCCION A LA PROGRAMACION",               creditos: 0, trimestreSugerido: 2  },
    { clave: "SHI104",  nombre: "INGLES 02 (BASICO II)",                                       creditos: 0, trimestreSugerido: 2  },

    // ── Trimestre 3 (20 CR) ──────────────────────────────────────────────────
    { clave: "CBF210",  nombre: "FISICA MECANICA I",                                           creditos: 4, trimestreSugerido: 3  },
    { clave: "CBF210L", nombre: "LABORATORIO DE FISICA MECANICA I",                            creditos: 1, trimestreSugerido: 3  },
    { clave: "CBM201",  nombre: "CALCULO INTEGRAL",                                            creditos: 5, trimestreSugerido: 3  },
    { clave: "IDS202",  nombre: "TECNOLOGIA DE OBJETOS",                                       creditos: 4, trimestreSugerido: 3  },
    { clave: "IDS202L", nombre: "LABORATORIO TECNOLOGIA DE OBJETOS",                           creditos: 1, trimestreSugerido: 3  },
    { clave: "IDS340",  nombre: "DESARROLLO DE SOFTWARE I",                                    creditos: 3, trimestreSugerido: 3  },
    { clave: "IDS340L", nombre: "LABORATORIO DE DESARROLLO DE SOFTWARE I",                     creditos: 1, trimestreSugerido: 3  },
    { clave: "ING228",  nombre: "HOJA DE CALCULO PARA INGENIEROS",                             creditos: 1, trimestreSugerido: 3  },
    { clave: "SHI105",  nombre: "INGLES 03 (INTERMEDIO I)",                                    creditos: 0, trimestreSugerido: 3  },

    // ── Trimestre 4 (20 CR) ──────────────────────────────────────────────────
    { clave: "AHQ101",  nombre: "QUEHACER CIENTIFICO",                                         creditos: 4, trimestreSugerido: 4  },
    { clave: "CBF211",  nombre: "FISICA MECANICA II",                                          creditos: 4, trimestreSugerido: 4  },
    { clave: "CBF211L", nombre: "LABORATORIO DE FISICA MECANICA II",                           creditos: 1, trimestreSugerido: 4  },
    { clave: "CBM202",  nombre: "CALCULO VECTORIAL",                                           creditos: 5, trimestreSugerido: 4  },
    { clave: "CSH113",  nombre: "PENSAMIENTO CREATIVO",                                        creditos: 2, trimestreSugerido: 4  },
    { clave: "IDS341",  nombre: "DESARROLLO DE SOFTWARE II",                                   creditos: 3, trimestreSugerido: 4  },
    { clave: "IDS341L", nombre: "LABORATORIO DE DESARROLLO DE SOFTWARE II",                    creditos: 1, trimestreSugerido: 4  },
    { clave: "IDS342",  nombre: "CONSEJERIA PROFESIONAL INGENIERIA DE SOFTWARE I",             creditos: 0, trimestreSugerido: 4  },
    { clave: "SHI106",  nombre: "INGLES 04 (INTERMEDIO II)",                                   creditos: 0, trimestreSugerido: 4  },

    // ── Trimestre 5 (22 CR) ──────────────────────────────────────────────────
    { clave: "CBM208",  nombre: "ALGEBRA LINEAL",                                              creditos: 5, trimestreSugerido: 5  },
    { clave: "IDS208",  nombre: "TEAM BUILDING",                                               creditos: 4, trimestreSugerido: 5  },
    { clave: "IDS311",  nombre: "PROCESO DE SOFTWARE",                                         creditos: 4, trimestreSugerido: 5  },
    { clave: "IDS324",  nombre: "INGENIERIA DE REQUERIMIENTOS DE SOFTWARE",                    creditos: 4, trimestreSugerido: 5  },
    { clave: "IDS324L", nombre: "LABORATORIO INGENIERIA DE REQUERIMIENTOS DE SOFTWARE",        creditos: 1, trimestreSugerido: 5  },
    { clave: "IDS343",  nombre: "ESTRUCTURAS DE DATOS Y ALGORITMOS I",                         creditos: 3, trimestreSugerido: 5  },
    { clave: "IDS343L", nombre: "LABORATORIO ESTRUCTURAS DE DATOS Y ALGORITMOS I",             creditos: 1, trimestreSugerido: 5  },
    { clave: "SHI107",  nombre: "INGLES 05 (AVANZADO I)",                                      creditos: 0, trimestreSugerido: 5  },

    // ── Trimestre 6 (20 CR) ──────────────────────────────────────────────────
    { clave: "CBM203",  nombre: "ECUACIONES DIFERENCIALES",                                    creditos: 5, trimestreSugerido: 6  },
    { clave: "CSH105",  nombre: "PROYECTO INTEGRADOR DE ESTUDIOS GENERALES",                   creditos: 2, trimestreSugerido: 6  },
    { clave: "IDS344",  nombre: "ESTRUCTURAS DE DATOS Y ALGORITMOS II",                        creditos: 3, trimestreSugerido: 6  },
    { clave: "IDS344L", nombre: "LABORATORIO ESTRUCTURAS DE DATOS Y ALGORITMOS II",            creditos: 1, trimestreSugerido: 6  },
    { clave: "IEC208",  nombre: "FUNDAMENTOS ELECTRONICA DIGITAL",                             creditos: 3, trimestreSugerido: 6  },
    { clave: "IEC208L", nombre: "LABORATORIO FUNDAMENTOS ELECTRONICA DIGITAL",                 creditos: 1, trimestreSugerido: 6  },
    { clave: "INS377",  nombre: "BASES DE DATOS I",                                            creditos: 4, trimestreSugerido: 6  },
    { clave: "INS377L", nombre: "LABORATORIO BASES DE DATOS I",                                creditos: 1, trimestreSugerido: 6  },
    { clave: "SHI108",  nombre: "INGLES 06 (AVANZADO II)",                                     creditos: 0, trimestreSugerido: 6  },

    // ── Trimestre 7 (21 CR) ──────────────────────────────────────────────────
    { clave: "CBM305",  nombre: "MATEMATICA DISCRETA I",                                       creditos: 4, trimestreSugerido: 7  },
    { clave: "IDS329",  nombre: "INGENIERIA DE FACTORES HUMANOS",                              creditos: 4, trimestreSugerido: 7  },
    { clave: "IDS329L", nombre: "LABORATORIO INGENIERIA DE FACTORES HUMANOS",                  creditos: 1, trimestreSugerido: 7  },
    { clave: "IDS345",  nombre: "DESARROLLO DE SOFTWARE III",                                  creditos: 3, trimestreSugerido: 7  },
    { clave: "IDS345L", nombre: "LABORATORIO DE DESARROLLO DE SOFTWARE III",                   creditos: 1, trimestreSugerido: 7  },
    { clave: "IDS346",  nombre: "MODELOS Y METODOS DE LA INGENIERIA DE SOFTWARE",              creditos: 3, trimestreSugerido: 7  },
    { clave: "INS380",  nombre: "BASES DE DATOS II",                                           creditos: 4, trimestreSugerido: 7  },
    { clave: "INS380L", nombre: "LABORATORIO DE BASES DE DATOS II",                            creditos: 1, trimestreSugerido: 7  },

    // ── Trimestre 8 (22 CR) ──────────────────────────────────────────────────
    { clave: "EEE2X1",  nombre: "ELECTIVAS DE ESTUDIOS ESPECIALIZADOS I",                      creditos: 0, trimestreSugerido: 8  },
    { clave: "ICS202",  nombre: "ALGORITMOS MALICIOSOS",                                       creditos: 4, trimestreSugerido: 8  },
    { clave: "ICS202L", nombre: "LABORATORIO DE ALGORITMOS MALICIOSOS",                        creditos: 1, trimestreSugerido: 8  },
    { clave: "IDS325",  nombre: "ASEGURAMIENTO DE LA CALIDAD DEL SOFTWARE",                    creditos: 4, trimestreSugerido: 8  },
    { clave: "IDS325L", nombre: "LABORATORIO ASEGURAMIENTO DE LA CALIDAD DEL SOFTWARE",        creditos: 1, trimestreSugerido: 8  },
    { clave: "IDS335",  nombre: "DISEÑO DE SOFTWARE",                                          creditos: 4, trimestreSugerido: 8  },
    { clave: "IDS347",  nombre: "TENDENCIAS EN DESARROLLO DE SOFTWARE",                        creditos: 3, trimestreSugerido: 8  },
    { clave: "IDS347L", nombre: "LABORATORIO TENDENCIAS EN DESARROLLO DE SOFTWARE",            creditos: 1, trimestreSugerido: 8  },
    { clave: "ING214",  nombre: "ANALISIS DE DATOS EN INGENIERIA",                             creditos: 4, trimestreSugerido: 8  },
    { clave: "ISE2X1",  nombre: "ELECTIVA DE INNOVACION SOCIAL I",                             creditos: 0, trimestreSugerido: 8  },

    // ── Trimestre 9 (19 CR) ──────────────────────────────────────────────────
    { clave: "CON213",  nombre: "FUNDAMENTOS DE CONTABILIDAD",                                 creditos: 2, trimestreSugerido: 9  },
    { clave: "IDS303",  nombre: "PRACTICA PROFESIONAL DE INGENIERIA DE SOFTWARE",              creditos: 2, trimestreSugerido: 9  },
    { clave: "IDS309",  nombre: "ARQUITECTURA DE SOFTWARE",                                    creditos: 4, trimestreSugerido: 9  },
    { clave: "IDS348",  nombre: "DESARROLLO DE APLICACIONES WEB",                              creditos: 3, trimestreSugerido: 9  },
    { clave: "IDS348L", nombre: "LABORATORIO DESARROLLO DE APLICACIONES WEB",                  creditos: 1, trimestreSugerido: 9  },
    { clave: "ING230",  nombre: "INGENIERIA ECONOMICA",                                        creditos: 4, trimestreSugerido: 9  },
    { clave: "ING231",  nombre: "EXPERIMENTACION EN INGENIERIA",                               creditos: 3, trimestreSugerido: 9  },

    // ── Trimestre 10 (18 CR) — incluye electiva de impacto social ────────────
    { clave: "IDS326",  nombre: "CONSTRUCCION DE SOFTWARE",                                    creditos: 4, trimestreSugerido: 10 },
    { clave: "IDS326L", nombre: "LABORATORIO CONSTRUCCION DE SOFTWARE",                        creditos: 1, trimestreSugerido: 10 },
    { clave: "IDS349",  nombre: "DESARROLLO DE APLICACIONES MOBILES",                          creditos: 3, trimestreSugerido: 10 },
    { clave: "IDS349L", nombre: "LABORATORIO DESARROLLO DE APLICACIONES MOBILES",              creditos: 1, trimestreSugerido: 10 },
    { clave: "ING235",  nombre: "FORMULACION Y GESTION DE PROYECTOS TECNOLOGICOS",             creditos: 4, trimestreSugerido: 10 },
    { clave: "ING235L", nombre: "LABORATORIO FORMULACION Y GESTION DE PROYECTOS TECNOLOGICOS", creditos: 1, trimestreSugerido: 10 },
    { clave: "INS371",  nombre: "ARQUITECTURA DEL COMPUTADOR",                                 creditos: 3, trimestreSugerido: 10 },
    { clave: "INS371L", nombre: "LABORATORIO ARQUITECTURA COMPUTADOR",                         creditos: 1, trimestreSugerido: 10 },
    // ISE2E1 = Electiva Innovación Social — cursada como ING237 (Impacto Social)
    { clave: "ISE2E1",  nombre: "IMPACTO SOCIAL (ELECTIVA)",                                   creditos: 4, trimestreSugerido: 10 },

    // ── Trimestre 11 (20 CR) ─────────────────────────────────────────────────
    { clave: "ECO322",  nombre: "ECONOMIA DE EMPRESA",                                         creditos: 4, trimestreSugerido: 11 },
    { clave: "IDS328",  nombre: "ADMINISTRACION DE CONFIGURACION",                             creditos: 4, trimestreSugerido: 11 },
    { clave: "IDS328L", nombre: "LABORATORIO DE ADMINISTRACION DE CONFIGURACION",              creditos: 1, trimestreSugerido: 11 },
    { clave: "IDS330",  nombre: "INTELIGENCIA ARTIFICIAL",                                     creditos: 3, trimestreSugerido: 11 },
    { clave: "IDS330L", nombre: "LABORATORIO INTELIGENCIA ARTIFICIAL",                         creditos: 1, trimestreSugerido: 11 },
    { clave: "IDS350",  nombre: "CONSEJERIA PROFESIONAL INGENIERIA DE SOFTWARE II",            creditos: 0, trimestreSugerido: 11 },
    { clave: "IDS351",  nombre: "PRUEBAS DE SOFTWARE",                                         creditos: 2, trimestreSugerido: 11 },
    { clave: "INS373",  nombre: "SISTEMAS OPERATIVOS",                                         creditos: 4, trimestreSugerido: 11 },
    { clave: "INS373L", nombre: "LABORATORIO SISTEMAS OPERATIVOS",                             creditos: 1, trimestreSugerido: 11 },

    // ── Trimestre 12 (18 CR) ─────────────────────────────────────────────────
    { clave: "ADM315",  nombre: "ADMINISTRACION Y GESTION EMPRESARIAL",                        creditos: 4, trimestreSugerido: 12 },
    { clave: "EEE2X1",  nombre: "ELECTIVAS DE ESTUDIOS ESPECIALIZADOS I",                      creditos: 0, trimestreSugerido: 12 }, // ya existe en T8, se omite duplicado
    { clave: "ICS320",  nombre: "FUNDAMENTOS DE CIBERSEGURIDAD",                               creditos: 2, trimestreSugerido: 12 },
    { clave: "IDS339",  nombre: "DEVOPS Y DEVSECOPS",                                          creditos: 3, trimestreSugerido: 12 },
    { clave: "IDS352",  nombre: "ANTEPROYECTO DE GRADO",                                       creditos: 4, trimestreSugerido: 12 },
    { clave: "IDS353",  nombre: "PASANTIA PROFESIONAL I",                                      creditos: 2, trimestreSugerido: 12 },
    { clave: "IDS354",  nombre: "GESTION DE LA INGENIERIA DE SOFTWARE",                        creditos: 3, trimestreSugerido: 12 },

    // ── Trimestre 13 (10 CR) ─────────────────────────────────────────────────
    // EEE2X2 = cursada como CSG210 (Derechos Humanos)
    { clave: "EEE2X2",  nombre: "ELECTIVAS DE ESTUDIOS ESPECIALIZADOS II",                     creditos: 0, trimestreSugerido: 13 },
    // EEP3X1 = cursada como CO (convalidada)
    { clave: "EEP3X1",  nombre: "ELECTIVAS DE ESTUDIOS PROFESIONALIZANTES I",                  creditos: 0, trimestreSugerido: 13 },
    { clave: "IDS322",  nombre: "MANTENIMIENTO DE SOFTWARE",                                   creditos: 4, trimestreSugerido: 13 },
    { clave: "IDS355",  nombre: "PROYECTO DE GRADO",                                           creditos: 4, trimestreSugerido: 13 },
    { clave: "IDS356",  nombre: "PASANTIA PROFESIONAL II",                                     creditos: 2, trimestreSugerido: 13 },
    { clave: "IDS3X5",  nombre: "CERTIFICACION PROFESIONAL",                                   creditos: 0, trimestreSugerido: 13 },

    // ── Trimestre 14 (8 CR) ──────────────────────────────────────────────────
    // EEP3X2 = cursada como ADM337 (Derecho Comercial)
    { clave: "EEP3X2",  nombre: "ELECTIVAS DE ESTUDIOS PROFESIONALIZANTES II",                 creditos: 0, trimestreSugerido: 14 },
    // EEP3X3 = cursada como INS369 (Inteligencia de Negocios)
    { clave: "EEP3X3",  nombre: "ELECTIVAS DE ESTUDIOS PROFESIONALIZANTES III",                creditos: 0, trimestreSugerido: 14 },
    { clave: "IDS334",  nombre: "SEMINARIO DE TECNOLOGIA E INGENIERIA DE SOFTWARE",            creditos: 4, trimestreSugerido: 14 },
    { clave: "IDS357",  nombre: "PROYECTO FINAL DE GRADO",                                     creditos: 4, trimestreSugerido: 14 },
  ];

  // Estado real según el récord (fuente de verdad: Record_Según_Pensum PDF)
  const cursando  = new Set(['CBM208', 'IDS328', 'IDS328L']);
  const pendientes = new Set(['CBM203', 'CBM305', 'INS380', 'INS380L', 'IDS330', 'IDS330L', 'IDS3X5', 'ADM315', 'IDS354']);
  // CBM202 fue reprobada múltiples veces y aprobada con C en Feb-Abr 2026
  // ISE2E1 ya tiene nota (ING237 → A)

  // Calificaciones reales por clave (del récord oficial)
  const calificacionesReales = {
    // T1
    'AHC109': 'B',  'AHO102': 'A',  'CBA1X3': 'A',  'CBM101': 'CO', 'CSH112': 'CO',
    'EAA1X1': 'B+', 'EAA1X2': 'C',  'EAA1X3': 'A',  'IDS207': 'A',  'SHI103': 'EI',
    // T2
    'AHC110': 'A',  'CBM102': 'CO', 'CSS102': 'CO', 'EAA1X4': 'A',
    'IDS323': 'A',  'IDS323L': 'A', 'ING102': 'CO', 'ING102L': 'CO','SHI104': 'EI',
    // T3
    'CBF210': 'CO', 'CBF210L': 'CO','CBM201': 'C',  'IDS202': 'CO', 'IDS202L': 'CO',
    'IDS340': 'CO', 'IDS340L': 'CO','ING228': 'A',  'SHI105': 'EI',
    // T4
    'AHQ101': 'B',  'CBF211': 'A',  'CBF211L': 'B', 'CBM202': 'C',  'CSH113': 'A',
    'IDS341': 'A',  'IDS341L': 'A', 'IDS342': 'A',  'SHI106': 'A',
    // T5
    'IDS208': 'A',  'IDS311': 'A',  'IDS324': 'A',  'IDS324L': 'A',
    'IDS343': 'CO', 'IDS343L': 'CO','SHI107': 'A',
    // T6
    'CSH105': 'A',  'IDS344': 'A',  'IDS344L': 'A', 'IEC208': 'A',  'IEC208L': 'A',
    'INS377': 'B+', 'INS377L': 'B', 'SHI108': 'A',
    // T7
    'IDS329': 'A',  'IDS329L': 'A', 'IDS345': 'A',  'IDS345L': 'A',
    'IDS346': 'A',  'IDS350': 'A',
    // T8
    'EEE2X1': 'CO', 'ICS202': 'A',  'ICS202L': 'A', 'IDS325': 'A',  'IDS325L': 'A',
    'IDS335': 'A',  'IDS347': 'A',  'IDS347L': 'A', 'ING214': 'A',
    // T9
    'CON213': 'A',  'IDS303': 'A',  'IDS309': 'A',  'IDS348': 'A',  'IDS348L': 'A',
    'ING230': 'B',  'ING231': 'A',
    // T10
    'IDS326': 'A',  'IDS326L': 'A', 'IDS349': 'A',  'IDS349L': 'A',
    'ING235': 'A',  'ING235L': 'A', 'INS371': 'A',  'INS371L': 'A', 'ISE2E1': 'A',
    // T11
    'ECO322': 'A',  'IDS351': 'A',  'INS373': 'A',  'INS373L': 'A',
    // T12
    'ICS320': 'A+', 'IDS339': 'A',  'IDS352': 'A',  'IDS353': 'A',
    // T13
    'EEE2X2': 'A',  'EEP3X1': 'CO', 'IDS322': 'A',  'IDS355': 'A',  'IDS356': 'A',
    // T14
    'EEP3X2': 'A',  'EEP3X3': 'A',  'IDS334': 'A',  'IDS357': 'A',
    // Restantes
    'ISE2X1': 'CO', 'IDS354': null,
  };

  // Crear materias en AsignaturaPensum (sin duplicar EEE2X1)
  const clavesYaCreadas = new Set();
  for (const m of pensumOficial) {
    if (clavesYaCreadas.has(m.clave)) continue; // evitar duplicado EEE2X1
    clavesYaCreadas.add(m.clave);

    let estado = "Aprobada";
    let calificacion = calificacionesReales[m.clave] ?? 'A';

    if (cursando.has(m.clave)) {
      estado = "Cursando";
      calificacion = null;
    } else if (pendientes.has(m.clave)) {
      estado = "Pendiente";
      calificacion = null;
    } else if (['CO', 'EI'].includes(calificacion)) {
      estado = "Aprobada"; // convalidadas/exoneradas cuentan como aprobadas
    }

    await prisma.asignaturaPensum.create({
      data: { clave: m.clave, nombre: m.nombre, creditos: m.creditos, trimestreSugerido: m.trimestreSugerido, estado, calificacion }
    });
  }
  console.log(`✅ Pensum cargado: ${clavesYaCreadas.size} materias.`);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. HISTORIAL ACADÉMICO
  //    - claveMateria usa SIEMPRE la clave del pensum (no la real cursada)
  //    - calificacion, puntos e indiceTrimestral son del récord oficial
  //    - Las materias con Calif. CO/EI se agrupan en el primer trimestre real
  //      en que el sistema las registró (Agosto-Octubre 2022)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("3. Creando historial académico...");

  const historial = [
    // ── T1: Agosto - Octubre 2022 ─────────────────────────────────────────────
    // Aquí el récord muestra todas las CO/EI más las 3 materias reales cursadas
    {
      periodo: "Agosto - Octubre 2022",
      estado: "CERRADO",
      creditosAprobados: 10,
      gpa: 3.20,
      indiceTrimestral: 3.20,
      indiceAcumulado: 3.20,
      asignaturas: [
        // Convalidadas (CO) — el sistema las registró en este trimestre
        { clave: "CBF210",  calif: "CO", cr: 4,  pts: 0   },
        { clave: "CBF210L", calif: "CO", cr: 1,  pts: 0   },
        { clave: "CBM101",  calif: "CO", cr: 5,  pts: 0   },
        { clave: "CBM102",  calif: "CO", cr: 5,  pts: 0   },
        { clave: "CSH112",  calif: "CO", cr: 2,  pts: 0   },
        { clave: "CSS102",  calif: "CO", cr: 2,  pts: 0   },
        { clave: "EEE2X1",  calif: "CO", cr: 0,  pts: 0   },
        { clave: "EEP3X1",  calif: "CO", cr: 0,  pts: 0   },
        { clave: "IDS202",  calif: "CO", cr: 4,  pts: 0   },
        { clave: "IDS202L", calif: "CO", cr: 1,  pts: 0   },
        { clave: "IDS340",  calif: "CO", cr: 3,  pts: 0   },
        { clave: "IDS340L", calif: "CO", cr: 1,  pts: 0   },
        { clave: "IDS343",  calif: "CO", cr: 3,  pts: 0   },
        { clave: "IDS343L", calif: "CO", cr: 1,  pts: 0   },
        { clave: "ING102",  calif: "CO", cr: 2,  pts: 0   },
        { clave: "ING102L", calif: "CO", cr: 0,  pts: 0   },
        { clave: "SHI103",  calif: "EI", cr: 0,  pts: 0   },
        { clave: "SHI104",  calif: "EI", cr: 0,  pts: 0   },
        { clave: "SHI105",  calif: "EI", cr: 0,  pts: 0   },
        // Materias reales cursadas este trimestre
        { clave: "AHC109",  calif: "B",  cr: 4,  pts: 12  },
        { clave: "AHQ101",  calif: "B",  cr: 4,  pts: 12  },
        { clave: "IDS207",  calif: "A",  cr: 2,  pts: 8   },
      ]
    },

    // ── T2: Noviembre 2022 - Enero 2023 ─────────────────────────────────────
    {
      periodo: "Noviembre 2022 - Enero 2023",
      estado: "CERRADO",
      creditosAprobados: 23,
      gpa: 3.35,
      indiceTrimestral: 3.35,
      indiceAcumulado: 3.30,
      asignaturas: [
        { clave: "AHC110",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "AHO102",  calif: "A",  cr: 0,  pts: 0   },
        // EAA1X1 cursada como ASM104 (Vida Saludable)
        { clave: "EAA1X1",  calif: "B+", cr: 2,  pts: 7   },
        // EAA1X2 cursada como ASM107 (Nutrición Saludable)
        { clave: "EAA1X2",  calif: "C",  cr: 2,  pts: 4   },
        // EAA1X3 cursada como CBA106 (Ambiente y Cultura)
        { clave: "EAA1X3",  calif: "A",  cr: 2,  pts: 8   },
        { clave: "CBM201",  calif: "C",  cr: 5,  pts: 10  },
        { clave: "IDS323",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "IDS323L", calif: "A",  cr: 1,  pts: 4   },
        { clave: "ING228",  calif: "A",  cr: 1,  pts: 4   },
        // EAA1X4 cursada como NEG101 (Inteligencia Financiera)
        { clave: "EAA1X4",  calif: "A",  cr: 2,  pts: 8   },
      ]
    },

    // ── T3: Febrero - Abril 2023 ─────────────────────────────────────────────
    {
      periodo: "Febrero - Abril 2023",
      estado: "CERRADO",
      creditosAprobados: 8,
      gpa: 4.00,
      indiceTrimestral: 4.00,
      indiceAcumulado: 3.44,
      asignaturas: [
        { clave: "IDS208",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "IDS341",  calif: "A",  cr: 3,  pts: 12  },
        { clave: "IDS341L", calif: "A",  cr: 1,  pts: 4   },
        { clave: "IDS342",  calif: "A",  cr: 0,  pts: 0   },
        { clave: "SHI106",  calif: "A",  cr: 0,  pts: 0   },
      ]
    },

    // ── T4: Mayo - Julio 2023 ────────────────────────────────────────────────
    {
      periodo: "Mayo - Julio 2023",
      estado: "CERRADO",
      creditosAprobados: 10,
      gpa: 3.90,
      indiceTrimestral: 3.90,
      indiceAcumulado: 3.53,
      asignaturas: [
        { clave: "CBF211",  calif: "R",  cr: 4,  pts: 0   }, // Reprobada (R)
        { clave: "CBF211L", calif: "B",  cr: 1,  pts: 3   },
        { clave: "CSH105",  calif: "A",  cr: 2,  pts: 8   },
        { clave: "CSH113",  calif: "A",  cr: 2,  pts: 8   },
        { clave: "IDS324",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "IDS324L", calif: "A",  cr: 1,  pts: 4   },
        { clave: "SHI107",  calif: "A",  cr: 0,  pts: 0   },
      ]
    },

    // ── T5: Agosto - Octubre 2023 ────────────────────────────────────────────
    {
      periodo: "Agosto - Octubre 2023",
      estado: "CERRADO",
      creditosAprobados: 17,
      gpa: 3.82,
      indiceTrimestral: 3.82,
      indiceAcumulado: 3.60,
      asignaturas: [
        { clave: "IDS329",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "IDS329L", calif: "A",  cr: 1,  pts: 4   },
        { clave: "IDS344",  calif: "A",  cr: 3,  pts: 12  },
        { clave: "IDS344L", calif: "A",  cr: 1,  pts: 4   },
        { clave: "IDS346",  calif: "A",  cr: 3,  pts: 12  },
        { clave: "INS377",  calif: "B+", cr: 4,  pts: 14  },
        { clave: "INS377L", calif: "B",  cr: 1,  pts: 3   },
      ]
    },

    // ── T6: Noviembre 2023 - Enero 2024 ─────────────────────────────────────
    {
      periodo: "Noviembre 2023 - Enero 2024",
      estado: "CERRADO",
      creditosAprobados: 15,
      gpa: 4.00,
      indiceTrimestral: 4.00,
      indiceAcumulado: 3.68,
      asignaturas: [
        { clave: "CBF211",  calif: "A",  cr: 4,  pts: 16  }, // 2do intento → aprobada
        { clave: "IDS345",  calif: "A",  cr: 3,  pts: 12  },
        { clave: "IDS345L", calif: "A",  cr: 1,  pts: 4   },
        { clave: "IDS350",  calif: "A",  cr: 0,  pts: 0   },
        { clave: "ING214",  calif: "A",  cr: 4,  pts: 16  },
        // ISE2E1 cursada como ING237 (Impacto Social)
        { clave: "ISE2E1",  calif: "A",  cr: 4,  pts: 16  },
      ]
    },

    // ── T7: Febrero - Abril 2024 ─────────────────────────────────────────────
    {
      periodo: "Febrero - Abril 2024",
      estado: "CERRADO",
      creditosAprobados: 22,
      gpa: 3.32,
      indiceTrimestral: 3.32,
      indiceAcumulado: 3.60,
      asignaturas: [
        // CBA1X3 cursada como CBA103 (Gestión Ambiental)
        { clave: "CBA1X3",  calif: "A",  cr: 2,  pts: 8   },
        { clave: "CBM202",  calif: "D",  cr: 5,  pts: 5   }, // 1er intento → D
        // EEE2X2 cursada como CSG210 (Derechos Humanos)
        { clave: "EEE2X2",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "IDS335",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "IDS347",  calif: "A",  cr: 3,  pts: 12  },
        { clave: "IDS347L", calif: "A",  cr: 1,  pts: 4   },
        { clave: "ING231",  calif: "A",  cr: 3,  pts: 12  },
      ]
    },

    // ── T8: Mayo - Julio 2024 ────────────────────────────────────────────────
    {
      periodo: "Mayo - Julio 2024",
      estado: "CERRADO",
      creditosAprobados: 19,
      gpa: 3.79,
      indiceTrimestral: 3.79,
      indiceAcumulado: 3.63,
      asignaturas: [
        { clave: "IDS303",  calif: "A",  cr: 2,  pts: 8   },
        { clave: "IDS309",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "IDS325",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "IDS325L", calif: "A",  cr: 1,  pts: 4   },
        { clave: "IEC208",  calif: "A",  cr: 3,  pts: 12  },
        { clave: "IEC208L", calif: "A",  cr: 1,  pts: 4   },
        { clave: "ING230",  calif: "B",  cr: 4,  pts: 12  },
        { clave: "SHI108",  calif: "A",  cr: 0,  pts: 0   },
      ]
    },

    // ── T9: Agosto - Octubre 2024 ────────────────────────────────────────────
    {
      periodo: "Agosto - Octubre 2024",
      estado: "CERRADO",
      creditosAprobados: 19,
      gpa: 2.95,
      indiceTrimestral: 2.95,
      indiceAcumulado: 3.54,
      asignaturas: [
        // EEP3X2 cursada como ADM337 (Derecho Comercial)
        { clave: "EEP3X2",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "CBM202",  calif: "F",  cr: 5,  pts: 0   }, // 2do intento → F
        { clave: "IDS326",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "IDS326L", calif: "A",  cr: 1,  pts: 4   },
        { clave: "ING235",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "ING235L", calif: "A",  cr: 1,  pts: 4   },
      ]
    },

    // ── T10: Noviembre 2024 - Enero 2025 ────────────────────────────────────
    {
      periodo: "Noviembre 2024 - Enero 2025",
      estado: "CERRADO",
      creditosAprobados: 14,
      gpa: 4.00,
      indiceTrimestral: 4.00,
      indiceAcumulado: 3.58,
      asignaturas: [
        { clave: "IDS311",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "IDS348",  calif: "A",  cr: 3,  pts: 12  },
        { clave: "IDS348L", calif: "A",  cr: 1,  pts: 4   },
        { clave: "IDS353",  calif: "A",  cr: 2,  pts: 8   },
        { clave: "INS371",  calif: "A",  cr: 3,  pts: 12  },
        { clave: "INS371L", calif: "A",  cr: 1,  pts: 4   },
      ]
    },

    // ── T11: Febrero - Abril 2025 ────────────────────────────────────────────
    {
      periodo: "Febrero - Abril 2025",
      estado: "CERRADO",
      creditosAprobados: 14,
      gpa: 4.00,
      indiceTrimestral: 4.00,
      indiceAcumulado: 3.62,
      asignaturas: [
        { clave: "CON213",  calif: "A",  cr: 2,  pts: 8   },
        { clave: "IDS349",  calif: "A",  cr: 3,  pts: 12  },
        { clave: "IDS349L", calif: "A",  cr: 1,  pts: 4   },
        { clave: "IDS351",  calif: "A",  cr: 2,  pts: 8   },
        { clave: "IDS352",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "IDS356",  calif: "A",  cr: 2,  pts: 8   },
      ]
    },

    // ── T12: Mayo - Julio 2025 ───────────────────────────────────────────────
    {
      periodo: "Mayo - Julio 2025",
      estado: "CERRADO",
      creditosAprobados: 22,
      gpa: 3.32,
      indiceTrimestral: 3.32,
      indiceAcumulado: 3.58,
      asignaturas: [
        { clave: "CBM202",  calif: "D",  cr: 5,  pts: 5   }, // 3er intento → D
        { clave: "IDS322",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "IDS334",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "IDS355",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "INS373",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "INS373L", calif: "A",  cr: 1,  pts: 4   },
      ]
    },

    // ── T13: Agosto - Octubre 2025 ───────────────────────────────────────────
    {
      periodo: "Agosto - Octubre 2025",
      estado: "CERRADO",
      creditosAprobados: 20,
      gpa: 4.00,
      indiceTrimestral: 4.00,
      indiceAcumulado: 3.62,
      asignaturas: [
        { clave: "ECO322",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "ICS202",  calif: "A",  cr: 4,  pts: 16  },
        { clave: "ICS202L", calif: "A",  cr: 1,  pts: 4   },
        { clave: "IDS339",  calif: "A",  cr: 3,  pts: 12  },
        { clave: "IDS357",  calif: "A",  cr: 4,  pts: 16  },
        // EEP3X3 cursada como INS369 (Inteligencia de Negocios)
        { clave: "EEP3X3",  calif: "A",  cr: 4,  pts: 16  },
      ]
    },

    // ── T14: Noviembre 2025 - Enero 2026 ────────────────────────────────────
    {
      periodo: "Noviembre 2025 - Enero 2026",
      estado: "CERRADO",
      creditosAprobados: 9,
      gpa: 3.89,
      indiceTrimestral: 3.89,
      indiceAcumulado: 3.63,
      asignaturas: [
        { clave: "ADM315",  calif: "A",  cr: 4,  pts: 15  },
        { clave: "CBM202",  calif: "R",  cr: 5,  pts: 0   }, // 4to intento → R
        { clave: "ICS320",  calif: "A+", cr: 2,  pts: 8   },
        { clave: "IDS354",  calif: "A+", cr: 3,  pts: 12  },
      ]
    },

    // ── T15: Febrero - Abril 2026 ────────────────────────────────────────────
    {
      periodo: "Febrero - Abril 2026",
      estado: "CERRADO",
      creditosAprobados: 5,
      gpa: 2.00,
      indiceTrimestral: 2.00,
      indiceAcumulado: 3.60,
      asignaturas: [
        { clave: "CBM202",  calif: "C",  cr: 5,  pts: 10  }, // 5to intento → C ✅
      ]
    },

    // ── T16: Mayo - Julio 2026 (ACTIVO) ─────────────────────────────────────
    {
      periodo: "Mayo - Julio 2026",
      estado: "ACTIVO",
      creditosAprobados: 0,
      gpa: 0.00,
      indiceTrimestral: 0.00,
      indiceAcumulado: 3.60,
      asignaturas: [
        { clave: "CBM208",  calif: null, cr: 5,  pts: null },
        { clave: "IDS328",  calif: null, cr: 4,  pts: null },
        { clave: "IDS328L", calif: null, cr: 1,  pts: null },
      ]
    },
  ];

  for (const t of historial) {
    await prisma.trimestre.create({
      data: {
        periodo:           t.periodo,
        estado:            t.estado,
        creditosAprobados: t.creditosAprobados,
        gpa:               t.gpa,
        indiceTrimestral:  t.indiceTrimestral,
        indiceAcumulado:   t.indiceAcumulado,
        asignaturas: {
          create: t.asignaturas.map(a => ({
            claveMateria: a.clave,
            calificacion: a.calif,
            puntos:       a.pts,
          }))
        }
      }
    });
  }
  console.log(`✅ Historial cargado: ${historial.length} trimestres.`);

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. VOLANTE DE SELECCIÓN ACTIVO
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("4. Creando Volante de Selección activo...");
  await prisma.volanteSeleccion.create({
    data: {
      periodo: "Mayo - Julio 2026",
      activo: true,
      horarios: {
        create: [
          { claveMateria: "CBM208",  profesor: "N/A", dia: "Lunes y Miércoles", horas: "20:00 - 22:00", aula: "GC-313 / VIRTUAL" },
          { claveMateria: "IDS328",  profesor: "N/A", dia: "Lunes y Miércoles", horas: "18:00 - 20:00", aula: "ER-202 / VIRTUAL"  },
          { claveMateria: "IDS328L", profesor: "N/A", dia: "Sábado",            horas: "09:00 - 12:00", aula: "LABTI411"          },
        ]
      }
    }
  });

  console.log("✅ ¡Seed completado exitosamente!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });