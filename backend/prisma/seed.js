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
    { clave: "EEE2X2",  nombre: "ELECTIVAS DE ESTUDIOS ESPECIALIZADOS II",                     creditos: 4, trimestreSugerido: 13 },
    // EEP3X1 = cursada como CO (convalidada)
    { clave: "EEP3X1",  nombre: "ELECTIVAS DE ESTUDIOS PROFESIONALIZANTES I",                  creditos: 0, trimestreSugerido: 13 },
    { clave: "IDS322",  nombre: "MANTENIMIENTO DE SOFTWARE",                                   creditos: 4, trimestreSugerido: 13 },
    { clave: "IDS355",  nombre: "PROYECTO DE GRADO",                                           creditos: 4, trimestreSugerido: 13 },
    { clave: "IDS356",  nombre: "PASANTIA PROFESIONAL II",                                     creditos: 2, trimestreSugerido: 13 },
    { clave: "IDS3X5",  nombre: "CERTIFICACION PROFESIONAL",                                   creditos: 0, trimestreSugerido: 13 },

    // ── Trimestre 14 (8 CR) ──────────────────────────────────────────────────
    // EEP3X2 = cursada como ADM337 (Derecho Comercial)
    { clave: "EEP3X2",  nombre: "ELECTIVAS DE ESTUDIOS PROFESIONALIZANTES II",                 creditos: 4, trimestreSugerido: 14 },
    // EEP3X3 = cursada como INS369 (Inteligencia de Negocios)
    { clave: "EEP3X3",  nombre: "ELECTIVAS DE ESTUDIOS PROFESIONALIZANTES III",                creditos: 4, trimestreSugerido: 14 },
    { clave: "IDS334",  nombre: "SEMINARIO DE TECNOLOGIA E INGENIERIA DE SOFTWARE",            creditos: 4, trimestreSugerido: 14 },
    { clave: "IDS357",  nombre: "PROYECTO FINAL DE GRADO",                                     creditos: 4, trimestreSugerido: 14 },
  ];

  // Estado real según el récord (fuente de verdad: Record_Según_Pensum PDF)
  const cursando  = new Set(['CBM203', 'IDS330', 'IDS330L']); // T18 (Nov 2026 - Ene 2027), inicia el 2/11/2026
  const pendientes = new Set(['CBM305', 'IDS3X5']);
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
    // T16 y T17 (récord impreso 21/10/2026)
    'CBM208': 'C',  'IDS328': 'A+', 'IDS328L': 'A+', 'INS380': 'A', 'INS380L': 'A',
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
    {
      periodo: "Agosto - Octubre 2022", estado: "CERRADO", creditosAprobados: 10,
      gpa: 3.20, indiceTrimestral: 3.20, indiceAcumulado: 3.20,
      asignaturas: [
        { clave: "CBF210",  calif: "CO", cr: 4, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "CBF210L", calif: "CO", cr: 1, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "CBM101",  calif: "CO", cr: 5, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "CBM102",  calif: "CO", cr: 5, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "CSH112",  calif: "CO", cr: 2, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "CSS102",  calif: "CO", cr: 2, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "EEE2X1",  calif: "CO", cr: 0, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "EEP3X1",  calif: "CO", cr: 0, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "IDS202",  calif: "CO", cr: 4, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "IDS202L", calif: "CO", cr: 1, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "IDS340",  calif: "CO", cr: 3, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "IDS340L", calif: "CO", cr: 1, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "IDS343",  calif: "CO", cr: 3, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "IDS343L", calif: "CO", cr: 1, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "ING102",  calif: "CO", cr: 2, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "ING102L", calif: "CO", cr: 0, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "SHI103",  calif: "EI", cr: 0, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "SHI104",  calif: "EI", cr: 0, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "SHI105",  calif: "EI", cr: 0, pts: 0, profesor: null, horario: null, aula: null },
        { clave: "AHC109",  calif: "B",  cr: 4, pts: 12, profesor: "Carlos Enrique Cabrera Garcia", horario: "Lun/Mier 09-11", aula: "GC302" },
        { clave: "AHQ101",  calif: "B",  cr: 4, pts: 12, profesor: "Lourdes Fernand Meyreles Vicioso", horario: "Mar/Jue 14-16", aula: "GC203" },
        { clave: "IDS207",  calif: "A",  cr: 2, pts: 8, profesor: "Osvaldo Antonio Mota De La Cruz", horario: "Lun 08-10", aula: "GC202" },
      ]
    },

    // ── T2: Noviembre 2022 - Enero 2023 ─────────────────────────────────────
    {
      periodo: "Noviembre 2022 - Enero 2023", estado: "CERRADO", creditosAprobados: 23,
      gpa: 3.35, indiceTrimestral: 3.35, indiceAcumulado: 3.30,
      asignaturas: [
        { clave: "AHC110",  calif: "A",  cr: 4, pts: 16, profesor: "Maritza Cecilia Franco Rodriguez", horario: "Mar/Jue 16-18", aula: "GC213" },
        { clave: "AHO102",  calif: "A",  cr: 0, pts: 0, profesor: "Alfonso Jiménez Vargas", horario: "Virtual", aula: "VIRTU" },
        { clave: "EAA1X1",  calif: "B+", cr: 2, pts: 7, profesor: "Priscilla Nicols Sepúlveda Doñé", horario: "Mier 12-14", aula: "VIRTU" },
        { clave: "EAA1X2",  calif: "C",  cr: 2, pts: 4, profesor: "Yudelka Maribel Ramirez Carrasco", horario: "Jue 14-16", aula: "VIRTU" },
        { clave: "EAA1X3",  calif: "A",  cr: 2, pts: 8, profesor: "Jeanette Martina Chaljub Hasbun", horario: "Mier 11-13", aula: "GC213" },
        { clave: "CBM201",  calif: "C",  cr: 5, pts: 10, profesor: "Luis Francisco Javier Figueroa Pérez", horario: "Mar/Jue 20-22, Vier 21-22", aula: "GC204/VIRTU" },
        { clave: "IDS323",  calif: "A",  cr: 4, pts: 16, profesor: "Francia Odalis Mejia Polanco", horario: "Mier 11-13", aula: "ER302" },
        { clave: "IDS323L", calif: "A",  cr: 1, pts: 4, profesor: "Francia Odalis Mejia Polanco", horario: "Vier 11-13", aula: "FD412" },
        { clave: "ING228",  calif: "A",  cr: 1, pts: 4, profesor: "Delia Virginia Delgado Giménez", horario: "Sáb 18-21", aula: "VIRTU" },
        { clave: "EAA1X4",  calif: "A",  cr: 2, pts: 8, profesor: "Julyanix Ramirez Paulino", horario: "Mar 20-21", aula: "VIRTU" },
      ]
    },

    // ── T3: Febrero - Abril 2023 ─────────────────────────────────────────────
    {
      periodo: "Febrero - Abril 2023", estado: "CERRADO", creditosAprobados: 8,
      gpa: 4.00, indiceTrimestral: 4.00, indiceAcumulado: 3.44,
      asignaturas: [
        { clave: "IDS208",  calif: "A",  cr: 4, pts: 16, profesor: "Jacqueline Josefina Vega De La Rosa", horario: "Lun 09-12", aula: "GC215" },
        { clave: "IDS341",  calif: "A",  cr: 3, pts: 12, profesor: "Buenaventura Pérez De Los Santos", horario: "Lun 09-12", aula: "GC212" },
        { clave: "IDS341L", calif: "A",  cr: 1, pts: 4, profesor: "Buenaventura Pérez De Los Santos", horario: "Mier 17-19", aula: "FD405" },
        { clave: "IDS342",  calif: "A",  cr: 0, pts: 0, profesor: "Jesús Nicolás Mejia Ortiz", horario: "Mar 14-16", aula: "GC212" },
        { clave: "SHI106",  calif: "A",  cr: 0, pts: 0, profesor: "Juan Manuel Gautier Jorge", horario: "Virtual", aula: "VIRTU" },
      ]
    },

    // ── T4: Mayo - Julio 2023 ────────────────────────────────────────────────
    {
      periodo: "Mayo - Julio 2023", estado: "CERRADO", creditosAprobados: 10,
      gpa: 3.90, indiceTrimestral: 3.90, indiceAcumulado: 3.53,
      asignaturas: [
        { clave: "CBF211",  calif: "R",  cr: 4, pts: 0, profesor: "Maria Dolores Durruthy Rodriguez", horario: "Lun/Mier 09-11", aula: "AH415" },
        { clave: "CBF211L", calif: "B",  cr: 1, pts: 3, profesor: "Héctor Ramón Lee Contreras", horario: "Mier 14-16", aula: "F202B" },
        { clave: "CSH105",  calif: "A",  cr: 2, pts: 8, profesor: "José Ramón Suriel Fernández", horario: "Virtual", aula: "VIRTU" },
        { clave: "CSH113",  calif: "A",  cr: 2, pts: 8, profesor: "Carolina Estefanía Pérez Puerta", horario: "Mar 11-13", aula: "GC212" },
        { clave: "IDS324",  calif: "A",  cr: 4, pts: 16, profesor: "Disneidis De Oleo Veriguete", horario: "Mar/Jue 20-22", aula: "GC204" },
        { clave: "IDS324L", calif: "A",  cr: 1, pts: 4, profesor: "Disneidis De Oleo Veriguete", horario: "Mier 14-16", aula: "GC203" },
        { clave: "SHI107",  calif: "A",  cr: 0, pts: 0, profesor: "Mónica Patricia Martinez Cudriz", horario: "Virtual", aula: "VIRTU" },
      ]
    },

    // ── T5: Agosto - Octubre 2023 ────────────────────────────────────────────
    {
      periodo: "Agosto - Octubre 2023", estado: "CERRADO", creditosAprobados: 17,
      gpa: 3.82, indiceTrimestral: 3.82, indiceAcumulado: 3.60,
      asignaturas: [
        { clave: "IDS329",  calif: "A",  cr: 4, pts: 16, profesor: "Marcos Miguel Brito Pascal", horario: "Mar 14-16", aula: "EL304/VIRTU" },
        { clave: "IDS329L", calif: "A",  cr: 1, pts: 4, profesor: "Marcos Miguel Brito Pascal", horario: "Mar 16-18", aula: "FD412/VIRTU" },
        { clave: "IDS344",  calif: "A",  cr: 3, pts: 12, profesor: "Casimiro Gilberto Cordero Ramirez", horario: "Jue 17-20", aula: "DP301" },
        { clave: "IDS344L", calif: "A",  cr: 1, pts: 4, profesor: "Casimiro Gilberto Cordero Ramírez", horario: "Jue 20-22", aula: "GC211/VIRTU" },
        { clave: "IDS346",  calif: "A",  cr: 3, pts: 12, profesor: "Edwin Felipe López Jiménez", horario: "Lun 09-12", aula: "GC303" },
        { clave: "INS377",  calif: "B+", cr: 4, pts: 14, profesor: "Fausto Rafael Richardson Hernández", horario: "Mar/Jue 18-20", aula: "AJ302/AJ401" },
        { clave: "INS377L", calif: "B",  cr: 1, pts: 3, profesor: "Fausto Rafael Richardson Hernández", horario: "Mar 20-22", aula: "FD403/VIRTU" },
      ]
    },

    // ── T6: Noviembre 2023 - Enero 2024 ─────────────────────────────────────
    {
      periodo: "Noviembre 2023 - Enero 2024", estado: "CERRADO", creditosAprobados: 15,
      gpa: 4.00, indiceTrimestral: 4.00, indiceAcumulado: 3.68,
      asignaturas: [
        { clave: "CBF211",  calif: "A",  cr: 4, pts: 16, profesor: "Roberto Antonio Quiñones", horario: "Lun/Mier 11-13", aula: "GC312" },
        { clave: "IDS345",  calif: "A",  cr: 3, pts: 12, profesor: "Carlos Rafael Méndez Comas", horario: "Lun/Mier 18-20", aula: "DP304/AJ302" },
        { clave: "IDS345L", calif: "A",  cr: 1, pts: 4, profesor: "Carlos Rafael Méndez Comas", horario: "Lun 20-22, Mar 15-16", aula: "GC303/VIRTU" },
        { clave: "IDS350",  calif: "A",  cr: 0, pts: 0, profesor: "Edwin Felipe López Jiménez", horario: "Lun 18-20", aula: "GC212" },
        { clave: "ING214",  calif: "A",  cr: 4, pts: 16, profesor: "Cristóbal Alexis Durán Jorrin", horario: "Mar/Jue 14-16", aula: "FD405" },
        { clave: "ISE2E1",  calif: "A",  cr: 4, pts: 16, profesor: "Omar Alejandro Guerra Alfonzo", horario: "Lun 09-13", aula: "AJ403" },
      ]
    },

    // ── T7: Febrero - Abril 2024 ─────────────────────────────────────────────
    {
      periodo: "Febrero - Abril 2024", estado: "CERRADO", creditosAprobados: 22,
      gpa: 3.32, indiceTrimestral: 3.32, indiceAcumulado: 3.60,
      asignaturas: [
        { clave: "CBA1X3",  calif: "A",  cr: 2, pts: 8, profesor: "David De Jesús Arias Canela", horario: "Jue 16-18", aula: "GC211" },
        { clave: "CBM202",  calif: "D",  cr: 5, pts: 5, profesor: "Ignacio Antonio Almonte Mora", horario: "Lun/Mier 09-11, Vier 10-11", aula: "EL304/VIRTU" },
        { clave: "EEE2X2",  calif: "A",  cr: 4, pts: 16, profesor: "Hipólito Catedral Diaz", horario: "Mar/Jue 18-20", aula: "GC302" },
        { clave: "IDS335",  calif: "A",  cr: 4, pts: 16, profesor: "Mario Antonio Luciano Recio", horario: "Lun 11-15", aula: "GC314" },
        { clave: "IDS347",  calif: "A",  cr: 3, pts: 12, profesor: "Lorenzo Solano Martinez", horario: "Lun 15-18", aula: "VIRTU" },
        { clave: "IDS347L", calif: "A",  cr: 1, pts: 4, profesor: "Lorenzo Solano Martinez", horario: "Lun 18-21", aula: "VIRTU" },
        { clave: "ING231",  calif: "A",  cr: 3, pts: 12, profesor: "Oscar Ali Corona Salazar", horario: "Lun 12-15", aula: "FD412" },
      ]
    },

    // ── T8: Mayo - Julio 2024 ────────────────────────────────────────────────
    {
      periodo: "Mayo - Julio 2024", estado: "CERRADO", creditosAprobados: 19,
      gpa: 3.79, indiceTrimestral: 3.79, indiceAcumulado: 3.63,
      asignaturas: [
        { clave: "IDS303",  calif: "A",  cr: 2, pts: 8, profesor: "Osvaldo Antonio Mota De La Cruz", horario: "Mar 11-13", aula: "EL201" },
        { clave: "IDS309",  calif: "A",  cr: 4, pts: 16, profesor: "Mario Antonio Luciano Recio", horario: "Mar/Jue 16-18", aula: "EP202" },
        { clave: "IDS325",  calif: "A",  cr: 4, pts: 16, profesor: "Francia Odalis Mejia Polanco", horario: "Mar/Jue 12-14", aula: "EL304/VIRTU" },
        { clave: "IDS325L", calif: "A",  cr: 1, pts: 4, profesor: "N/A", horario: "Sáb 18-21", aula: "ER302" },
        { clave: "IEC208",  calif: "A",  cr: 3, pts: 12, profesor: "Baldo Alberto Dalporto", horario: "Lun 09-12", aula: "GC303" },
        { clave: "IEC208L", calif: "A",  cr: 1, pts: 4, profesor: "Baldo Alberto Dalporto", horario: "Mier 16-18", aula: "FD201" },
        { clave: "ING230",  calif: "B",  cr: 4, pts: 12, profesor: "Freddy Florian Lara Felipe", horario: "Mar/Jue 14-16", aula: "EL204" },
        { clave: "SHI108",  calif: "A",  cr: 0, pts: 0, profesor: "Edwin De Jesús Gil Javier", horario: "Lun 07-09", aula: "DP304/VIRTU" },
      ]
    },

    // ── T9: Agosto - Octubre 2024 ────────────────────────────────────────────
    {
      periodo: "Agosto - Octubre 2024", estado: "CERRADO", creditosAprobados: 19,
      gpa: 2.95, indiceTrimestral: 2.95, indiceAcumulado: 3.54,
      asignaturas: [
        { clave: "EEP3X2",  calif: "A",  cr: 4, pts: 16, profesor: "Yocasta Del Ros Matias Almánzar", horario: "Mar/Jue 20-22", aula: "EL404/VIRTU" },
        { clave: "CBM202",  calif: "F",  cr: 5, pts: 0, profesor: "Juan Manuel Tersek Suárez", horario: "Mar/Jue 14-16, Vier 14-15", aula: "AJ402/VIRTU" },
        { clave: "IDS326",  calif: "A",  cr: 4, pts: 16, profesor: "Okelarys Sánchez Soto", horario: "Lun 18-20, Mier 20-22", aula: "VIRTU/AJ103" },
        { clave: "IDS326L", calif: "A",  cr: 1, pts: 4, profesor: "Okelarys Sánchez Soto", horario: "Lun 13-14, Mier 20-22", aula: "VIRTU/FD405" },
        { clave: "ING235",  calif: "A",  cr: 4, pts: 16, profesor: "Joel Francis Jiménez Báez", horario: "Lun 09-13", aula: "GC315" },
        { clave: "ING235L", calif: "A",  cr: 1, pts: 4, profesor: "Joel Francis Jiménez Báez", horario: "Lun 15-18", aula: "FD411" },
      ]
    },

    // ── T10: Noviembre 2024 - Enero 2025 ────────────────────────────────────
    {
      periodo: "Noviembre 2024 - Enero 2025", estado: "CERRADO", creditosAprobados: 14,
      gpa: 4.00, indiceTrimestral: 4.00, indiceAcumulado: 3.58,
      asignaturas: [
        { clave: "IDS311",  calif: "A",  cr: 4, pts: 16, profesor: "Jeannine Joselyn Hernández Lebreault", horario: "Lun 18-22", aula: "EP201" },
        { clave: "IDS348",  calif: "A",  cr: 3, pts: 12, profesor: "Santos Leonardo Ramos Medina", horario: "Jue 16-19", aula: "GC215" },
        { clave: "IDS348L", calif: "A",  cr: 1, pts: 4, profesor: "Santos Leonardo Ramos Medina", horario: "Jue 19-22", aula: "GC304" },
        { clave: "IDS353",  calif: "A",  cr: 2, pts: 8, profesor: "Jacqueline Josefina Vega De La Rosa", horario: "Mier 12-14", aula: "VIRTU" },
        { clave: "INS371",  calif: "A",  cr: 3, pts: 12, profesor: "Edwin Emil Pérez Arias", horario: "Lun 09-12", aula: "AJ303" },
        { clave: "INS371L", calif: "A",  cr: 1, pts: 4, profesor: "Edwin Emil Pérez Arias", horario: "Mier 17-20", aula: "FD412" },
      ]
    },

    // ── T11: Febrero - Abril 2025 ────────────────────────────────────────────
    {
      periodo: "Febrero - Abril 2025", estado: "CERRADO", creditosAprobados: 14,
      gpa: 4.00, indiceTrimestral: 4.00, indiceAcumulado: 3.62,
      asignaturas: [
        { clave: "CON213",  calif: "A",  cr: 2, pts: 8, profesor: "Carmen Elia Concepción Quiñonez", horario: "Jue 16-17", aula: "VIRTU" },
        { clave: "IDS349",  calif: "A",  cr: 3, pts: 12, profesor: "Buenaventura Pérez De Los Santos", horario: "Jue 16-19", aula: "AJ404" },
        { clave: "IDS349L", calif: "A",  cr: 1, pts: 4, profesor: "Buenaventura Pérez De Los Santos", horario: "Jue 19-22", aula: "FD405" },
        { clave: "IDS351",  calif: "A",  cr: 2, pts: 8, profesor: "José Anibal Ventura Robles", horario: "Mier 18-20", aula: "ER202" },
        { clave: "IDS352",  calif: "A",  cr: 4, pts: 16, profesor: "Edwin Felipe López Jiménez", horario: "Mier 18-22", aula: "DP401" },
        { clave: "IDS356",  calif: "A",  cr: 2, pts: 8, profesor: "Jacqueline Josefina Vega De La Rosa", horario: "Mier 12-14", aula: "VIRTU" },
      ]
    },

    // ── T12: Mayo - Julio 2025 ───────────────────────────────────────────────
    {
      periodo: "Mayo - Julio 2025", estado: "CERRADO", creditosAprobados: 22,
      gpa: 3.32, indiceTrimestral: 3.32, indiceAcumulado: 3.58,
      asignaturas: [
        { clave: "CBM202",  calif: "D",  cr: 5, pts: 5, profesor: "Ramón Antonio Ramírez Leonardo", horario: "Lun/Mier 07-09, Vier 07-08", aula: "GC204/VIRTU" },
        { clave: "IDS322",  calif: "A",  cr: 4, pts: 16, profesor: null, horario: null, aula: null }, // Mantenimiento (Datos no en el corte de PDF)
        { clave: "IDS334",  calif: "A",  cr: 4, pts: 16, profesor: "Yris Esther Brito Ruiz", horario: "Mar/Jue 16-18", aula: "EL304/VIRTU" },
        { clave: "IDS355",  calif: "A",  cr: 4, pts: 16, profesor: "Edwin Felipe López Jiménez", horario: "Mier 18-22", aula: "TESISVIR/TU" },
        { clave: "INS373",  calif: "A",  cr: 4, pts: 16, profesor: "Edwin Emil Pérez Arias", horario: "Mar/Jue 20-22", aula: "AJ204" },
        { clave: "INS373L", calif: "A",  cr: 1, pts: 4, profesor: "Edwin Emil Pérez Arias", horario: "Lun 17-18, Mar 18-20", aula: "VIRTU/GC202" },
      ]
    },

    // ── T13: Agosto - Octubre 2025 ───────────────────────────────────────────
    {
      periodo: "Agosto - Octubre 2025", estado: "CERRADO", creditosAprobados: 20,
      gpa: 4.00, indiceTrimestral: 4.00, indiceAcumulado: 3.62,
      asignaturas: [
        { clave: "ECO322",  calif: "A",  cr: 4, pts: 16, profesor: "Dilcia Margarita Matos Sánchez", horario: "Mar/Jue 16-18", aula: "AJ102" },
        { clave: "ICS202",  calif: "A",  cr: 4, pts: 16, profesor: "Anthony Cruz Marte", horario: "Lun/Mier 07-09", aula: "VIRTU" },
        { clave: "ICS202L", calif: "A",  cr: 1, pts: 4, profesor: "Anthony Cruz Marte", horario: "Mier 08-11", aula: "VIRTU" },
        { clave: "IDS339",  calif: "A",  cr: 3, pts: 12, profesor: "Gabriel Elivan Villalona Eusebio", horario: "Mier 18-21", aula: "GC314" },
        { clave: "IDS357",  calif: "A",  cr: 4, pts: 16, profesor: "Edwin Felipe López Jiménez", horario: "Mier 18-22", aula: "NPRES" },
        { clave: "EEP3X3",  calif: "A",  cr: 4, pts: 16, profesor: "Pavel Amaury Hernández Contreras", horario: "Mier 18-22", aula: "VIRTU" },
      ]
    },

    // ── T14: Noviembre 2025 - Enero 2026 ────────────────────────────────────
    {
      periodo: "Noviembre 2025 - Enero 2026", estado: "CERRADO", creditosAprobados: 9,
      gpa: 3.89, indiceTrimestral: 3.89, indiceAcumulado: 3.63,
      asignaturas: [
        { clave: "ADM315",  calif: "A",  cr: 4, pts: 15, profesor: "Ingrid Marisol González Díaz", horario: "Virtual", aula: "VIRTU" },
        { clave: "CBM202",  calif: "R",  cr: 5, pts: 0, profesor: "Juan Manuel Tersek Suárez", horario: "Mar/Jue 14-16, Vier 14-15", aula: "GC202/VIRTU" },
        { clave: "ICS320",  calif: "A+", cr: 2, pts: 8, profesor: "Niurka Del Carmen Hernández González", horario: "Lun 07-09", aula: "EL404" },
        { clave: "IDS354",  calif: "A+", cr: 3, pts: 12, profesor: "Pedro José Ramirez Rodriguez", horario: "Lun 07-10", aula: "VIRTU" },
      ]
    },

    // ── T15: Febrero - Abril 2026 ────────────────────────────────────────────
    {
      periodo: "Febrero - Abril 2026", estado: "CERRADO", creditosAprobados: 5,
      gpa: 2.00, indiceTrimestral: 2.00, indiceAcumulado: 3.60,
      asignaturas: [
        { clave: "CBM202",  calif: "C",  cr: 5, pts: 10, profesor: "Ignacio Antonio Almonte Mora", horario: "Lun/Mier 09-11, Vier 09-10", aula: "GC-213/GC-302/VIRTU" },
      ]
    },

    // ── T16: Mayo - Julio 2026 ───────────────────────────────────────────────
    {
      periodo: "Mayo - Julio 2026", estado: "CERRADO", creditosAprobados: 10,
      gpa: 2.50, indiceTrimestral: 2.50, indiceAcumulado: 3.55,
      asignaturas: [
        { clave: "CBM208",  calif: "D",  cr: 5, pts: 5,  profesor: "Giro Guillermo Candelario Villalona", horario: "Lun/Mier 20-22, Vier 18-19", aula: "GC-313/VIRTU" },
        { clave: "IDS328",  calif: "A+", cr: 4, pts: 16, profesor: "Gabriel Elivan Villalona Eusebio", horario: "Lun/Mier 18-20", aula: "ER-202/VIRTU" },
        { clave: "IDS328L", calif: "A+", cr: 1, pts: 4,  profesor: "Gabriel Elivan Villalona Eusebio", horario: "Sáb 09-12", aula: "LABT1411" },
      ]
    },

    // ── T17: Agosto - Octubre 2026 ───────────────────────────────────────────
    // Pagado: RD$ 50,449.75 (recibo 000000032318) = 53,105.00 − 5 %
    // Trimestre terminado (31/10/2026).
    {
      periodo: "Agosto - Octubre 2026", estado: "CERRADO", creditosAprobados: 10,
      gpa: 2.88, indiceTrimestral: 2.88, indiceAcumulado: 3.52,
      asignaturas: [
        { clave: "CBM208",  calif: "C", cr: 5, pts: 10,   profesor: "Pedro Jesus Lalondriz Mateo", horario: "Lun/Mier 07-09, Vier 07-08", aula: "EL402/VIRTU" },
        { clave: "INS380",  calif: "A", cr: 4, pts: 15,   profesor: "Jhonny De Jesus Liriano Batista", horario: "Mar/Jue 18-20", aula: "GC-213" },
        { clave: "INS380L", calif: "A", cr: 1, pts: 3.75, profesor: "Jhonny De Jesus Liriano Batista", horario: "Sáb 10-13", aula: "LABTI403" },
      ]
    },

    // ── T18: Noviembre 2026 - Enero 2027 (EN CURSO · 02/11/2026 al 31/01/2027) ──
    // Fuente: Volante de Selección impreso el 27/10/2026 (Mis Clases · BeeCampus)
    {
      periodo: "Noviembre 2026 - Enero 2027", estado: "ACTIVO", creditosAprobados: 0,
      gpa: null, indiceTrimestral: null, indiceAcumulado: 3.52,
      asignaturas: [
        { clave: "CBM203",  calif: null, cr: 5, pts: null, profesor: "Pedro Jesus Lalondriz Mateo",       horario: "Lun/Mier 18-20, Vier 18-19", aula: "GC-302/VIRTU" },
        { clave: "IDS330",  calif: null, cr: 3, pts: null, profesor: "Leopoldo Armando Martinez Diaz",    horario: "Jue 16-19",                  aula: "GC-313" },
        { clave: "IDS330L", calif: null, cr: 1, pts: null, profesor: "Leopoldo Armando Martinez Diaz",    horario: "Jue 19-22",                  aula: "AJ-403" },
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
            profesor:     a.profesor || null,
            horario:      a.horario || null,
            aula:         a.aula || null
          }))
        }
      }
    });
  }
  console.log(`✅ Historial cargado: ${historial.length} trimestres.`);

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. VOLANTE DE SELECCIÓN ACTIVO
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("4. Creando Volantes de Selección (T17 cerrado, T18 activo)...");
  // T17: Volante impreso el 6/8/2026. T18: Volante impreso el 27/10/2026 (Mis Clases · BeeCampus)
  const VOLANTE_T17 = [
    { claveMateria: "CBM208",  profesor: "Pedro Jesus Lalondriz Mateo",     dia: "Lunes y Miércoles", horas: "07:00 - 09:00", aula: "EL402 (Presencial)" },
    { claveMateria: "CBM208",  profesor: "Pedro Jesus Lalondriz Mateo",     dia: "Viernes",           horas: "07:00 - 08:00", aula: "VIRTUAL" },
    { claveMateria: "INS380",  profesor: "Jhonny De Jesus Liriano Batista", dia: "Martes y Jueves",   horas: "18:00 - 20:00", aula: "GC-213" },
    { claveMateria: "INS380L", profesor: "Jhonny De Jesus Liriano Batista", dia: "Sábado",            horas: "10:00 - 13:00", aula: "LABTI403" },
  ];
  const VOLANTE_T18 = [
    { claveMateria: "CBM203",  profesor: "Pedro Jesus Lalondriz Mateo",     dia: "Lunes y Miércoles", horas: "18:00 - 20:00", aula: "GC-302 (Presencial)" },
    { claveMateria: "CBM203",  profesor: "Pedro Jesus Lalondriz Mateo",     dia: "Viernes",           horas: "18:00 - 19:00", aula: "VIRTUAL" },
    { claveMateria: "IDS330",  profesor: "Leopoldo Armando Martinez Diaz",  dia: "Jueves",            horas: "16:00 - 19:00", aula: "GC-313" },
    { claveMateria: "IDS330L", profesor: "Leopoldo Armando Martinez Diaz",  dia: "Jueves",            horas: "19:00 - 22:00", aula: "AJ-403" },
  ];
  await prisma.volanteSeleccion.create({
    data: { periodo: "Agosto - Octubre 2026", activo: false, horarios: { create: VOLANTE_T17 } }
  });
  await prisma.volanteSeleccion.create({
    data: { periodo: "Noviembre 2026 - Enero 2027", activo: true, horarios: { create: VOLANTE_T18 } }
  });

  console.log("✅ ¡Seed completado exitosamente!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });