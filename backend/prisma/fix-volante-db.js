const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function actualizarVolante() {
  console.log("Iniciando actualización del Volante de Selección...");

  try {
    // 1. Desactivamos cualquier volante viejo que esté activo
    await prisma.volanteSeleccion.updateMany({
      where: { activo: true },
      data: { activo: false }
    });
    console.log("✔️ Volantes anteriores archivados.");

    // 2. Creamos el nuevo volante para Mayo - Julio 2026
    const periodoNuevo = "Mayo - Julio 2026";
    
    // Verificamos si ya existe para no duplicarlo, si no, lo creamos
    let volanteActivo = await prisma.volanteSeleccion.findUnique({
      where: { periodo: periodoNuevo }
    });

    if (!volanteActivo) {
      volanteActivo = await prisma.volanteSeleccion.create({
        data: {
          periodo: periodoNuevo,
          activo: true
        }
      });
      console.log(`✔️ Nuevo volante creado para: ${periodoNuevo}`);
    } else {
      // Si ya existía, lo reactivamos y borramos sus horarios viejos por si acaso
      await prisma.volanteSeleccion.update({
        where: { id: volanteActivo.id },
        data: { activo: true }
      });
      await prisma.horarioAsignatura.deleteMany({
        where: { volanteId: volanteActivo.id }
      });
      console.log(`✔️ Volante reactivado y limpiado para: ${periodoNuevo}`);
    }

    // 3. Insertamos tu horario real de la captura
    const nuevoHorario = [
      {
        claveMateria: "IDS328", // Guardamos la clave oficial del pensum para que enlace bien
        profesor: "POR ASIGNAR", // En la captura no sale el profesor, ponemos genérico
        dia: "Lunes",
        horas: "18:00 - 20:00",
        aula: "ER-202"
      },
      {
        claveMateria: "CBM208", 
        profesor: "POR ASIGNAR",
        dia: "Lunes",
        horas: "20:00 - 22:00",
        aula: "GC-313"
      },
      {
        claveMateria: "IDS328", 
        profesor: "POR ASIGNAR",
        dia: "Miércoles",
        horas: "18:00 - 20:00",
        aula: "VIRTUAL"
      },
      {
        claveMateria: "CBM208", 
        profesor: "POR ASIGNAR",
        dia: "Miércoles",
        horas: "20:00 - 22:00",
        aula: "GC-313"
      },
      {
        claveMateria: "CBM208", 
        profesor: "POR ASIGNAR",
        dia: "Viernes",
        horas: "18:00 - 19:00",
        aula: "VIRTUAL"
      },
      {
        claveMateria: "IDS328L", 
        profesor: "POR ASIGNAR",
        dia: "Sábado",
        horas: "09:00 - 12:00",
        aula: "LABTI411"
      }
    ];

    // Inyectamos los horarios atados al ID de este nuevo volante
    for (const horario of nuevoHorario) {
      await prisma.horarioAsignatura.create({
        data: {
          volanteId: volanteActivo.id,
          ...horario
        }
      });
    }
    
    console.log("✔️ Horarios insertados correctamente.");
    console.log("🚀 ¡El volante en el frontend se actualizará automáticamente!");

  } catch (error) {
    console.error("❌ Ocurrió un error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

actualizarVolante();