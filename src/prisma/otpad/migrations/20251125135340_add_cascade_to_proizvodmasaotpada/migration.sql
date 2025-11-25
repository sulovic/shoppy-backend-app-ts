-- DropForeignKey
ALTER TABLE "ProizvodMasaOtpada" DROP CONSTRAINT "ProizvodMasaOtpada_proizvodId_fkey";

-- AddForeignKey
ALTER TABLE "ProizvodMasaOtpada" ADD CONSTRAINT "ProizvodMasaOtpada_proizvodId_fkey" FOREIGN KEY ("proizvodId") REFERENCES "Proizvodi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
