-- CreateEnum
CREATE TYPE "StatusReklamacije" AS ENUM ('PRIJEM', 'OBRADA', 'OPRAVDANA', 'NEOPRAVDANA', 'DODATNI_ROK');

-- CreateEnum
CREATE TYPE "ZemljaReklamacije" AS ENUM ('SRBIJA', 'CRNA_GORA');

-- CreateTable
CREATE TABLE "Reklamacije" (
    "idReklamacije" SERIAL NOT NULL,
    "brojReklamacije" TEXT NOT NULL,
    "zemljaReklamacije" "ZemljaReklamacije" NOT NULL,
    "datumPrijema" TIMESTAMP(3),
    "odgovornaOsoba" TEXT,
    "imePrezime" TEXT NOT NULL,
    "adresa" TEXT,
    "telefon" TEXT NOT NULL,
    "email" TEXT,
    "datumKupovine" TIMESTAMP(3),
    "brojRacuna" TEXT,
    "nazivProizvoda" TEXT,
    "opisReklamacije" TEXT,
    "datumOdgovora" TIMESTAMP(3),
    "opisOdluke" TEXT,
    "komentar" TEXT,
    "smsSent" BOOLEAN NOT NULL DEFAULT false,
    "statusReklamacije" "StatusReklamacije" NOT NULL,
    "files" JSONB,

    CONSTRAINT "Reklamacije_pkey" PRIMARY KEY ("idReklamacije")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reklamacije_brojReklamacije_key" ON "Reklamacije"("brojReklamacije");

-- CreateIndex
CREATE INDEX "Reklamacije_zemljaReklamacije_statusReklamacije_idx" ON "Reklamacije"("zemljaReklamacije", "statusReklamacije");
