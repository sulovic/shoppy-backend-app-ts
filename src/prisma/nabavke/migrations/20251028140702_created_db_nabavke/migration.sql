-- CreateEnum
CREATE TYPE "Statusi" AS ENUM ('NACRT', 'PROIZVODNJA', 'TRANZIT', 'PRIMLJENA');

-- CreateEnum
CREATE TYPE "Zemlje" AS ENUM ('SRBIJA', 'CRNA_GORA');

-- CreateTable
CREATE TABLE "Porudzbine" (
    "id" SERIAL NOT NULL,
    "proFaktura" TEXT NOT NULL,
    "dobavljac" TEXT NOT NULL,
    "spediter" TEXT,
    "datumPorudzbine" TIMESTAMP(3) NOT NULL,
    "datumPolaska" TIMESTAMP(3),
    "datumPrijema" TIMESTAMP(3),
    "brojKontejnera" TEXT,
    "komentar" TEXT,
    "files" JSONB,
    "status" "Statusi" NOT NULL,
    "zemlja" "Zemlje" NOT NULL,

    CONSTRAINT "Porudzbine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sadrzaj" (
    "id" SERIAL NOT NULL,
    "porudzbinaId" INTEGER NOT NULL,
    "proizvodId" INTEGER NOT NULL,
    "kolicina" INTEGER NOT NULL,
    "cena" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Sadrzaj_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proizvodi" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "SKU" TEXT NOT NULL,

    CONSTRAINT "Proizvodi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Porudzbine_zemlja_status_idx" ON "Porudzbine"("zemlja", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Proizvodi_SKU_key" ON "Proizvodi"("SKU");

-- AddForeignKey
ALTER TABLE "Sadrzaj" ADD CONSTRAINT "Sadrzaj_porudzbinaId_fkey" FOREIGN KEY ("porudzbinaId") REFERENCES "Porudzbine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sadrzaj" ADD CONSTRAINT "Sadrzaj_proizvodId_fkey" FOREIGN KEY ("proizvodId") REFERENCES "Proizvodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
