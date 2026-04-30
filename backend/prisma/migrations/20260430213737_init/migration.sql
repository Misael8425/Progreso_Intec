-- CreateTable
CREATE TABLE "Simulacion" (
    "id" SERIAL NOT NULL,
    "indiceCalculado" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Simulacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asignatura" (
    "id" SERIAL NOT NULL,
    "simulacionId" INTEGER NOT NULL,
    "creditos" INTEGER NOT NULL,
    "calificacionLiteral" TEXT NOT NULL,
    "puntos" DOUBLE PRECISION,

    CONSTRAINT "Asignatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsignaturaPensum" (
    "id" SERIAL NOT NULL,
    "clave" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "creditos" INTEGER NOT NULL,
    "trimestreSugerido" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "calificacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsignaturaPensum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trimestre" (
    "id" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "indiceTrimestral" DOUBLE PRECISION,
    "indiceAcumulado" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trimestre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsignaturaCursada" (
    "id" TEXT NOT NULL,
    "trimestreId" TEXT NOT NULL,
    "claveMateria" TEXT NOT NULL,
    "calificacion" TEXT NOT NULL,
    "puntos" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AsignaturaCursada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolanteSeleccion" (
    "id" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolanteSeleccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HorarioAsignatura" (
    "id" TEXT NOT NULL,
    "volanteId" TEXT NOT NULL,
    "claveMateria" TEXT NOT NULL,
    "profesor" TEXT NOT NULL,
    "dia" TEXT NOT NULL,
    "horas" TEXT NOT NULL,
    "aula" TEXT NOT NULL,

    CONSTRAINT "HorarioAsignatura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AsignaturaPensum_clave_key" ON "AsignaturaPensum"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "VolanteSeleccion_periodo_key" ON "VolanteSeleccion"("periodo");

-- AddForeignKey
ALTER TABLE "Asignatura" ADD CONSTRAINT "Asignatura_simulacionId_fkey" FOREIGN KEY ("simulacionId") REFERENCES "Simulacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignaturaCursada" ADD CONSTRAINT "AsignaturaCursada_trimestreId_fkey" FOREIGN KEY ("trimestreId") REFERENCES "Trimestre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignaturaCursada" ADD CONSTRAINT "AsignaturaCursada_claveMateria_fkey" FOREIGN KEY ("claveMateria") REFERENCES "AsignaturaPensum"("clave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioAsignatura" ADD CONSTRAINT "HorarioAsignatura_volanteId_fkey" FOREIGN KEY ("volanteId") REFERENCES "VolanteSeleccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioAsignatura" ADD CONSTRAINT "HorarioAsignatura_claveMateria_fkey" FOREIGN KEY ("claveMateria") REFERENCES "AsignaturaPensum"("clave") ON DELETE RESTRICT ON UPDATE CASCADE;
