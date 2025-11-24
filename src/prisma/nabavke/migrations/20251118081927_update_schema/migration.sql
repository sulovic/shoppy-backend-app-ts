/*
  Warnings:

  - A unique constraint covering the columns `[porudzbinaId,proizvodId]` on the table `Sadrzaj` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Sadrzaj" DROP CONSTRAINT "Sadrzaj_porudzbinaId_fkey";

-- CreateIndex
CREATE INDEX "Sadrzaj_porudzbinaId_idx" ON "Sadrzaj"("porudzbinaId");

-- CreateIndex
CREATE INDEX "Sadrzaj_proizvodId_idx" ON "Sadrzaj"("proizvodId");

-- CreateIndex
CREATE UNIQUE INDEX "Sadrzaj_porudzbinaId_proizvodId_key" ON "Sadrzaj"("porudzbinaId", "proizvodId");

-- AddForeignKey
ALTER TABLE "Sadrzaj" ADD CONSTRAINT "Sadrzaj_porudzbinaId_fkey" FOREIGN KEY ("porudzbinaId") REFERENCES "Porudzbine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
