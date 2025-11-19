-- DropForeignKey
ALTER TABLE "public"."JciProizvodi" DROP CONSTRAINT "JciProizvodi_jciPodaciId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProizvodMasaOtpada" DROP CONSTRAINT "ProizvodMasaOtpada_vrstaOtpadaId_fkey";

-- AddForeignKey
ALTER TABLE "JciProizvodi" ADD CONSTRAINT "JciProizvodi_jciPodaciId_fkey" FOREIGN KEY ("jciPodaciId") REFERENCES "JciPodaci"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProizvodMasaOtpada" ADD CONSTRAINT "ProizvodMasaOtpada_vrstaOtpadaId_fkey" FOREIGN KEY ("vrstaOtpadaId") REFERENCES "VrsteOtpada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
