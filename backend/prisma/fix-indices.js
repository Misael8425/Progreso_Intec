const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function recalcularIndices() {
  console.log("📊 Iniciando recálculo matemático de índices históricos...");

  // Diccionario de valores por letra 
  // (Nota: Si INTEC usa un modelo estricto de A=4, B=3, C=2, D=1, F=0, este diccionario lo mapea. 
  // Incluyo las medias letras por si acaso las usas en tu sistema).
  const puntosPorLetra = {
    'A': 4.0, 'A+': 4.0,
    'B+': 3.5, 'B': 3.0,
    'C+': 2.5, 'C': 2.0,
    'D': 1.0,  'F': 0.0
  };

  // Orden cronológico de los periodos del INTEC
  const ordenPeriodo = {
    "Febrero - Abril": 1,
    "Mayo - Julio": 2,
    "Agosto - Octubre": 3,
    "Noviembre - Enero": 4
  };

  try {
    // 1. Extraemos todos los trimestres con sus materias y créditos
    const trimestres = await prisma.trimestre.findMany({
      include: {
        asignaturas: {
          include: {
            asignaturaPensum: true // Para poder leer los créditos de cada materia
          }
        }
      }
    });

    // 2. Los ordenamos estrictamente por Año y luego por Periodo cronológico
    trimestres.sort((a, b) => {
      if (a.anio !== b.anio) return a.anio - b.anio;
      return ordenPeriodo[a.periodo] - ordenPeriodo[b.periodo];
    });

    let totalPuntosAcumulados = 0;
    let totalCreditosAcumulados = 0;
    let ultimoIndiceAcumuladoValido = 0;

    // 3. Iteramos y calculamos trimestre por trimestre
    for (let i = 0; i < trimestres.length; i++) {
      const trim = trimestres[i];
      let puntosTrimestre = 0;
      let creditosTrimestre = 0;

      for (const asig of trim.asignaturas) {
        const letra = asig.calificacion ? asig.calificacion.toUpperCase() : null;
        const creditos = asig.asignaturaPensum.creditos;

        // Solo procesamos letras válidas (Ignoramos 'CO', 'EI', 'R', o null)
        if (letra && puntosPorLetra[letra] !== undefined) {
          puntosTrimestre += (puntosPorLetra[letra] * creditos);
          creditosTrimestre += creditos;
        }
      }

      // Cálculo del índice del trimestre (GPA)
      let indiceTrimestral = 0;
      if (creditosTrimestre > 0) {
        indiceTrimestral = puntosTrimestre / creditosTrimestre;
      }

      // Sumamos al acumulado general
      totalPuntosAcumulados += puntosTrimestre;
      totalCreditosAcumulados += creditosTrimestre;

      // Cálculo del índice general acumulado
      let indiceAcumulado = ultimoIndiceAcumuladoValido; 
      if (totalCreditosAcumulados > 0) {
        indiceAcumulado = totalPuntosAcumulados / totalCreditosAcumulados;
        ultimoIndiceAcumuladoValido = indiceAcumulado; // Guardamos por si el siguiente trimestre está vacío
      }

      // Actualizamos la base de datos
      await prisma.trimestre.update({
        where: { id: trim.id },
        data: {
          indiceTrimestral: parseFloat(indiceTrimestral.toFixed(2)),
          indiceAcumulado: parseFloat(indiceAcumulado.toFixed(2))
        }
      });

      console.log(`✔️ ${trim.periodo} ${trim.anio} -> Trimestral: ${indiceTrimestral.toFixed(2)} | Acumulado: ${indiceAcumulado.toFixed(2)}`);
    }

    console.log("🚀 ¡Todos los índices han sido corregidos con éxito!");

  } catch (error) {
    console.error("❌ Ocurrió un error calculando los índices:", error);
  } finally {
    await prisma.$disconnect();
  }
}

recalcularIndices();