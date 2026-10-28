// src/utils/electivas.js
// Datos estáticos de electivas y convalidaciones del plan IDS-2020 (Ingeniería de Software, INTEC).
// Fuentes: Pensum_Software (Consejo Académico 02/11/2023), listas de electivas del INTEC y
// "Convalidación Final" ITLA → INTEC impresa el 12/07/2022.

// ────────────────────────────────────────────────────────────────────────────
// 1. Convalidación ITLA → INTEC (11 grupos, 55 créditos ITLA → 34 créditos INTEC)
// ────────────────────────────────────────────────────────────────────────────
export const CONVALIDACIONES = [
  {
    itla: [
      { clave: 'TDS 003', nombre: 'Programación I', cr: 4 },
      { clave: 'TDS 004', nombre: 'Análisis y Diseño de Sistemas', cr: 4 },
    ],
    intec: [
      { clave: 'IDS202',  nombre: 'Tecnología de Objetos', cr: 4 },
      { clave: 'IDS202L', nombre: 'Lab. Tecnología de Objetos', cr: 1 },
    ],
  },
  {
    itla: [{ clave: 'HIS-102', nombre: 'Historia Dominicana', cr: 3 }],
    intec: [{ clave: 'CSS102', nombre: 'Ser Humano y Sociedad: Temas Sociales Contemporáneos', cr: 2 }],
  },
  {
    itla: [{ clave: 'TDS-001', nombre: 'Introducción a la Elaboración de Algoritmos', cr: 4 }],
    intec: [
      { clave: 'IDS343',  nombre: 'Estructuras de Datos y Algoritmos I', cr: 3 },
      { clave: 'IDS343L', nombre: 'Laboratorio Estructuras de Datos y Algoritmos I', cr: 1 },
    ],
  },
  {
    itla: [
      { clave: 'FIS 110',   nombre: 'Física General', cr: 4 },
      { clave: 'FIS 110 L', nombre: 'Laboratorio Física General', cr: 1 },
    ],
    intec: [
      { clave: 'CBF210',  nombre: 'Física Mecánica I', cr: 4 },
      { clave: 'CBF210L', nombre: 'Laboratorio de Física Mecánica I', cr: 1 },
    ],
  },
  {
    itla: [{ clave: 'TDS 006', nombre: 'Programación II', cr: 4 }],
    intec: [
      { clave: 'IDS340',  nombre: 'Desarrollo de Software I', cr: 3 },
      { clave: 'IDS340L', nombre: 'Laboratorio de Desarrollo de Software I', cr: 1 },
    ],
  },
  {
    itla: [
      { clave: 'TI 101',  nombre: 'Fundamentos del Computador', cr: 4 },
      { clave: 'TDS-002', nombre: 'Fundamentos de Programación', cr: 4 },
    ],
    intec: [
      { clave: 'ING102',  nombre: 'Introducción a la Programación', cr: 2 },
      { clave: 'ING102L', nombre: 'Lab. Introducción a la Programación', cr: 0 },
    ],
  },
  {
    itla: [{ clave: 'CBG 210', nombre: 'Probabilidad y Estadística', cr: 3 }],
    intec: [{ clave: 'EEE2X1', nombre: 'Electivas de Estudios Especializados I', cr: 0, electiva: true }],
  },
  {
    itla: [{ clave: 'TDS 005', nombre: 'Diseño Centrado en el Usuario', cr: 4 }],
    // En el documento aparece como EFP3X1; en el plan actual es EEP3X1.
    intec: [{ clave: 'EEP3X1', nombre: 'Electiva Profesional I (EFP3X1 en el documento)', cr: 0, electiva: true }],
  },
  {
    itla: [
      { clave: 'CBG-110', nombre: 'Ética 1', cr: 3 },
      { clave: 'CBG-115', nombre: 'Ética 2', cr: 3 },
    ],
    intec: [{ clave: 'CSH112', nombre: 'Ciudadanía y Ética', cr: 2 }],
  },
  {
    itla: [{ clave: 'MAT-101', nombre: 'Cálculo Diferencial', cr: 5 }],
    intec: [{ clave: 'CBM102', nombre: 'Cálculo Diferencial', cr: 5 }],
  },
  {
    itla: [{ clave: 'MAT 001', nombre: 'Precálculo', cr: 5 }],
    intec: [{ clave: 'CBM101', nombre: 'Álgebra y Geometría Analítica', cr: 5 }],
  },
];

export const sumarCreditos = (lista) => lista.reduce((acc, m) => acc + m.cr, 0);
export const TOTAL_CREDITOS_ITLA = CONVALIDACIONES.reduce((acc, g) => acc + sumarCreditos(g.itla), 0);   // 55
export const TOTAL_CREDITOS_CONVALIDADOS = CONVALIDACIONES.reduce((acc, g) => acc + sumarCreditos(g.intec), 0); // 34

// ────────────────────────────────────────────────────────────────────────────
// 2. Electivas: espacio del plan → materia realmente cursada
//    `slot` es la clave genérica del pensum (la que usa la base de datos).
// ────────────────────────────────────────────────────────────────────────────
export const COMPONENTES_ELECTIVAS = [
  {
    id: 'medioambiente',
    titulo: 'Vida en el Medio Ambiente',
    clave: 'Componente general (100)',
    requerido: 2,
    nota: 'Una electiva de 2 créditos (CBA101 a CBA105).',
    espacios: [
      { slot: 'CBA1X3', real: { clave: 'CBA103', nombre: 'Fundamentos de Gestión Ambiental' } },
    ],
  },
  {
    id: 'areas',
    titulo: 'Electivas de Áreas Académicas',
    clave: 'Componente general (100)',
    requerido: 8,
    nota: 'Cuatro electivas de 2 créditos (EAA1X1 a EAA1X4).',
    espacios: [
      { slot: 'EAA1X1', real: { clave: 'ASM104', nombre: 'Vida Saludable' } },
      { slot: 'EAA1X2', real: { clave: 'ASM107', nombre: 'Nutrición Saludable' } },
      { slot: 'EAA1X3', real: { clave: 'CBA106', nombre: 'Ambiente y Cultura' } },
      { slot: 'EAA1X4', real: { clave: 'NEG101', nombre: 'Inteligencia Financiera' } },
    ],
  },
  {
    id: 'impacto',
    titulo: 'Impacto Social',
    clave: 'Componente especializado (200)',
    requerido: 4,
    nota: 'Una electiva de 4 créditos (CSH237, CBA202, ING237 o NEG208).',
    espacios: [
      { slot: 'ISE2E1', real: { clave: 'ING237', nombre: 'Impacto Social (ING)' } },
    ],
  },
  {
    id: 'especializadas',
    titulo: 'Electivas de Estudios Especializados',
    clave: 'Componente especializado (200)',
    requerido: 4,
    nota: 'Cuatro créditos libres: dos materias de 2 créditos o una de 4.',
    espacios: [
      {
        slot: 'EEE2X1',
        convalidada: { itla: 'CBG 210 · Probabilidad y Estadística', cr: 0 },
      },
      {
        slot: 'EEE2X2',
        real: { clave: 'CSG210', nombre: 'Derechos Humanos', nota: 'Aparece como CSH210 en la lista de electivas' },
      },
    ],
  },
  {
    id: 'profesionales',
    titulo: 'Electivas de Estudios Profesionalizantes',
    clave: 'Componente profesional (300)',
    requerido: 12,
    nota: 'Doce créditos de electivas profesionales de Ingeniería de Software.',
    espacios: [
      {
        slot: 'EEP3X1',
        convalidada: { itla: 'TDS 005 · Diseño Centrado en el Usuario', cr: 0 },
      },
      { slot: 'EEP3X2', real: { clave: 'ADM337', nombre: 'Derecho Comercial' } },
      { slot: 'EEP3X3', real: { clave: 'INS369', nombre: 'Inteligencia de Negocios' } },
    ],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// 3. Cruza las electivas con el historial (periodo, nota, créditos)
//    historial: arreglo de trimestres ordenado del más antiguo al más reciente.
// ────────────────────────────────────────────────────────────────────────────
export const resumenElectivas = (historial = []) => {
  const buscar = (slot) => {
    for (let i = 0; i < historial.length; i++) {
      const asig = (historial[i].asignaturas ?? []).find(a => a.claveMateria === slot);
      if (asig) {
        return {
          numeroTrimestre: i + 1,
          periodo: historial[i].periodo,
          calificacion: asig.calificacion,
          creditos: asig.asignaturaPensum?.creditos ?? 0,
        };
      }
    }
    return null;
  };

  return COMPONENTES_ELECTIVAS.map((comp) => {
    const espacios = comp.espacios.map((esp) => ({ ...esp, cursada: buscar(esp.slot) }));
    const obtenido = espacios.reduce((acc, e) => acc + (e.cursada?.creditos ?? 0), 0);
    return {
      ...comp,
      espacios,
      obtenido,
      faltante: Math.max(comp.requerido - obtenido, 0),
    };
  });
};
