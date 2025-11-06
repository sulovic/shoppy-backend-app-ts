-- CreateEnum
CREATE TYPE "Operacija" AS ENUM ('UVOZ', 'IZVOZ');

-- CreateEnum
CREATE TYPE "Zemlja" AS ENUM ('SRBIJA', 'CRNA_GORA');

-- CreateTable
CREATE TABLE "JciPodaci" (
    "id" SERIAL NOT NULL,
    "zemlja" "Zemlja" NOT NULL,
    "datum" TIMESTAMP(3) NOT NULL,
    "operacija" "Operacija" NOT NULL,
    "brojJci" TEXT NOT NULL,

    CONSTRAINT "JciPodaci_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JciProizvodi" (
    "id" SERIAL NOT NULL,
    "kolicina" DOUBLE PRECISION NOT NULL,
    "proizvodId" INTEGER NOT NULL,
    "jciPodaciId" INTEGER NOT NULL,

    CONSTRAINT "JciProizvodi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proizvodi" (
    "id" SERIAL NOT NULL,
    "proizvod" TEXT NOT NULL,

    CONSTRAINT "Proizvodi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VrsteOtpada" (
    "id" SERIAL NOT NULL,
    "vrstaOtpada" TEXT NOT NULL,

    CONSTRAINT "VrsteOtpada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProizvodMasaOtpada" (
    "id" SERIAL NOT NULL,
    "masa" DOUBLE PRECISION NOT NULL,
    "proizvodId" INTEGER NOT NULL,
    "vrstaOtpadaId" INTEGER NOT NULL,

    CONSTRAINT "ProizvodMasaOtpada_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JciPodaci_zemlja_operacija_brojJci_idx" ON "JciPodaci"("zemlja", "operacija", "brojJci");

-- AddForeignKey
ALTER TABLE "JciProizvodi" ADD CONSTRAINT "JciProizvodi_proizvodId_fkey" FOREIGN KEY ("proizvodId") REFERENCES "Proizvodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JciProizvodi" ADD CONSTRAINT "JciProizvodi_jciPodaciId_fkey" FOREIGN KEY ("jciPodaciId") REFERENCES "JciPodaci"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProizvodMasaOtpada" ADD CONSTRAINT "ProizvodMasaOtpada_proizvodId_fkey" FOREIGN KEY ("proizvodId") REFERENCES "Proizvodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProizvodMasaOtpada" ADD CONSTRAINT "ProizvodMasaOtpada_vrstaOtpadaId_fkey" FOREIGN KEY ("vrstaOtpadaId") REFERENCES "VrsteOtpada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
