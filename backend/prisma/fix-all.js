const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando script maestro de limpieza y migración...\n");

  try {
    // PASO 1: Resetear todas las materias (Ocultarlas)
    console.log('[1/5] Seteando trimestreSugerido a 0 en TODAS las materias...');
    await prisma.asignaturaPensum.updateMany({
      data: { trimestreSugerido: 0 }
    });

    // PASO 2: Leer y actualizar el pensum oficial base
    console.log('[2/5] Extrayendo datos de seed.js y actualizando pensum oficial...');
    const seedContent = fs.readFileSync(path.join(__dirname, 'seed.js'), 'utf-8');
    
    // Extraer el arreglo pensumOficial usando regex para no ejecutar el script
    const arrayMatch = seedContent.match(/const pensumOficial = (\[[\s\S]*?\]);/);
    if (!arrayMatch) throw new Error("No se encontró pensumOficial en seed.js");
    
    const materiasCorrectas = eval(arrayMatch[1]);

    for (const materia of materiasCorrectas) {
      await prisma.asignaturaPensum.updateMany({
        where: { clave: materia.clave },
        data: {
          trimestreSugerido: materia.trimestreSugerido,
          nombre: materia.nombre,
          creditos: materia.creditos
        }
      });
    }

    // PASO 3: Eliminar códigos genéricos
    console.log('[3/5] Eliminando códigos genéricos vacíos de INTEC...');
    const genericas = [
      'CBA1X3', 'EAA1X1', 'EAA1X2', 'EAA1X3', 'EAA1X4', 
      'ISE2X1', 'EEE2X2', 'EFP3X1', 'EFP3X2', 'EFP3X3'
    ];
    await prisma.asignaturaPensum.deleteMany({
      where: { clave: { in: genericas } }
    });

    // PASO 4: Acomodar electivas reales y convalidaciones
    console.log('[4/5] Acomodando electivas reales e inyectando convalidaciones...');
    const electivasReales = [
      { clave: "CBA103", nombre: "FUNDAMENTO DE GESTION AMBIENTAL", creditos: 2, trimestreSugerido: 1 },
      { clave: "ASM104", nombre: "VIDA SALUDABLE", creditos: 2, trimestreSugerido: 1 },
      { clave: "ASM107", nombre: "NUTRICION SALUDABLE", creditos: 2, trimestreSugerido: 1 },
      { clave: "CBA106", nombre: "AMBIENTE Y CULTURA", creditos: 2, trimestreSugerido: 1 },
      { clave: "NEG101", nombre: "INTELIGENCIA FINANCIERA", creditos: 2, trimestreSugerido: 2 },
      { clave: "ING237", nombre: "IMPACTO SOCIAL (ELECTIVA)", creditos: 4, trimestreSugerido: 8 },
      { clave: "CSG210", nombre: "DERECHOS HUMANOS (ELECTIVA)", creditos: 4, trimestreSugerido: 13 },
      { clave: "EEP3X1", nombre: "ELECTIVAS DE ESTUDIOS PROF. I", creditos: 0, trimestreSugerido: 13 },
      { clave: "ISE2X2", nombre: "INNOVACION SOCIAL II (CUBIERTA POR ING237)", creditos: 0, trimestreSugerido: 13, estado: "Aprobada", calificacion: "CO" },
      { clave: "ADM337", nombre: "DERECHO COMERCIAL", creditos: 4, trimestreSugerido: 14 },
      { clave: "INS369", nombre: "INTELIGENCIA DE NEGOCIOS", creditos: 4, trimestreSugerido: 14 }
    ];

    for (const electiva of electivasReales) {
      const dataUpdate = {
        trimestreSugerido: electiva.trimestreSugerido,
        nombre: electiva.nombre,
        creditos: electiva.creditos
      };

      if (electiva.estado) dataUpdate.estado = electiva.estado;
      if (electiva.calificacion) dataUpdate.calificacion = electiva.calificacion;

      await prisma.asignaturaPensum.upsert({
        where: { clave: electiva.clave },
        update: dataUpdate,
        create: { 
          clave: electiva.clave,
          ...dataUpdate,
          estado: electiva.estado || 'Pendiente'
        }
      });
    }

    // PASO 5: Corregir materia específica (Laboratorio)
    console.log('[5/5] Corrigiendo estado de IDS345L a Aprobada (A)...');
    await prisma.asignaturaPensum.update({
      where: { clave: "IDS345L" },
      data: {
        estado: "Aprobada",
        calificacion: "A"
      }
    });

    console.log("\n✅ ¡Todos los procesos terminaron con éxito! La base de datos está impecable.");

  } catch (error) {
    console.error("\n❌ Hubo un error durante la ejecución de los scripts:");
    console.error(error);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
