/*
  Warnings:

  - A unique constraint covering the columns `[brojJci]` on the table `JciPodaci` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "JciPodaci" ADD COLUMN     "files" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "JciPodaci_brojJci_key" ON "JciPodaci"("brojJci");
