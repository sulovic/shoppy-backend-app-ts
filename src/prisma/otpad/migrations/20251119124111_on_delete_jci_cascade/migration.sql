-- DropForeignKey
ALTER TABLE "public"."ProizvodMasaOtpada" DROP CONSTRAINT "ProizvodMasaOtpada_vrstaOtpadaId_fkey";

-- AddForeignKey
ALTER TABLE "ProizvodMasaOtpada" ADD CONSTRAINT "ProizvodMasaOtpada_vrstaOtpadaId_fkey" FOREIGN KEY ("vrstaOtpadaId") REFERENCES "VrsteOtpada"("id") ON DELETE CASCADE ON UPDATE CASCADE;
