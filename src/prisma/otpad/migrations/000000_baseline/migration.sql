-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."Operacija" AS ENUM ('UVOZ', 'IZVOZ');

-- CreateEnum
CREATE TYPE "public"."Zemlja" AS ENUM ('SRBIJA', 'CRNA_GORA');

-- CreateTable
CREATE TABLE "public"."JciPodaci" (
    "id" SERIAL NOT NULL,
    "zemlja" "public"."Zemlja" NOT NULL,
    "datum" TIMESTAMP(3) NOT NULL,
    "operacija" "public"."Operacija" NOT NULL,
    "brojJci" TEXT NOT NULL,
    "files" JSONB,

    CONSTRAINT "JciPodaci_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JciProizvodi" (
    "id" SERIAL NOT NULL,
    "kolicina" DOUBLE PRECISION NOT NULL,
    "proizvodId" INTEGER NOT NULL,
    "jciPodaciId" INTEGER NOT NULL,

    CONSTRAINT "JciProizvodi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProizvodMasaOtpada" (
    "id" SERIAL NOT NULL,
    "masa" DOUBLE PRECISION NOT NULL,
    "proizvodId" INTEGER NOT NULL,
    "vrstaOtpadaId" INTEGER NOT NULL,

    CONSTRAINT "ProizvodMasaOtpada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Proizvodi" (
    "id" SERIAL NOT NULL,
    "proizvod" TEXT NOT NULL,

    CONSTRAINT "Proizvodi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VrsteOtpada" (
    "id" SERIAL NOT NULL,
    "vrstaOtpada" TEXT NOT NULL,

    CONSTRAINT "VrsteOtpada_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JciPodaci_brojJci_key" ON "public"."JciPodaci"("brojJci" ASC);

-- CreateIndex
CREATE INDEX "JciPodaci_zemlja_operacija_brojJci_idx" ON "public"."JciPodaci"("zemlja" ASC, "operacija" ASC, "brojJci" ASC);

-- AddForeignKey
ALTER TABLE "public"."JciProizvodi" ADD CONSTRAINT "JciProizvodi_jciPodaciId_fkey" FOREIGN KEY ("jciPodaciId") REFERENCES "public"."JciPodaci"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JciProizvodi" ADD CONSTRAINT "JciProizvodi_proizvodId_fkey" FOREIGN KEY ("proizvodId") REFERENCES "public"."Proizvodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProizvodMasaOtpada" ADD CONSTRAINT "ProizvodMasaOtpada_proizvodId_fkey" FOREIGN KEY ("proizvodId") REFERENCES "public"."Proizvodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProizvodMasaOtpada" ADD CONSTRAINT "ProizvodMasaOtpada_vrstaOtpadaId_fkey" FOREIGN KEY ("vrstaOtpadaId") REFERENCES "public"."VrsteOtpada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

