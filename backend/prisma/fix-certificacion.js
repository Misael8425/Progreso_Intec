const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Verificando IDS345L y IDS3X5...");
  
  await prisma.asignaturaPensum.updateMany({
    where: { clave: "IDS345L" },
    data: {
      estado: "Aprobada",
      calificacion: "A"
    }
  });

  await prisma.asignaturaPensum.upsert({
    where: { clave: "IDS3X5" },
    update: { estado: "Pendiente" },
    create: {
      clave: "IDS3X5",
      nombre: "CERTIFICACION PROFESIONAL",
      creditos: 0,
      trimestreSugerido: 13,
      estado: "Pendiente"
    }
  });

  console.log("Completado.");
}
main().finally(() => prisma.$disconnect());
