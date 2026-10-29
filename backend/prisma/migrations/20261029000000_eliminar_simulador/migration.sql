/*
  Warnings:

  - You are about to drop the `Asignatura` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Simulacion` table. If the table is not empty, all the data it contains will be lost.

  Se elimina el simulador de índice: sus simulaciones guardadas no se usan en ninguna otra parte.
*/
-- DropForeignKey
ALTER TABLE "Asignatura" DROP CONSTRAINT "Asignatura_simulacionId_fkey";

-- DropTable
DROP TABLE "Asignatura";

-- DropTable
DROP TABLE "Simulacion";
