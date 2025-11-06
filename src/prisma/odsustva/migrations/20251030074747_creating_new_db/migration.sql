-- CreateEnum
CREATE TYPE "VrsteOdsutva" AS ENUM ('GODISNJI_ODMOR', 'SLUZBENI_PUT_U_ZEMLJI', 'SLUZBENI_PUT_U_INOSTRANSTVO', 'PLACENO_ODSUSTVO');

-- CreateTable
CREATE TABLE "EvidencijaOdsustva" (
    "id" SERIAL NOT NULL,
    "user" TEXT NOT NULL,
    "vrstaOdsustva" "VrsteOdsutva" NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "brojDana" INTEGER NOT NULL,
    "odobreno" BOOLEAN NOT NULL DEFAULT false,
    "odobrioUser" TEXT,

    CONSTRAINT "EvidencijaOdsustva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DodeljenaOdsustva" (
    "id" SERIAL NOT NULL,
    "user" TEXT NOT NULL,
    "vrstaOdsustva" "VrsteOdsutva" NOT NULL,
    "godina" INTEGER NOT NULL,
    "brojDana" INTEGER NOT NULL,
    "dodelioUser" TEXT NOT NULL,

    CONSTRAINT "DodeljenaOdsustva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EvidencijaOdsustva_user_idx" ON "EvidencijaOdsustva"("user");

-- CreateIndex
CREATE INDEX "DodeljenaOdsustva_user_godina_idx" ON "DodeljenaOdsustva"("user", "godina");
