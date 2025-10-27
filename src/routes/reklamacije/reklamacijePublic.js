const { PrismaClient } = require("../../prisma/reklamacije/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;

    const data = await prisma.reklamacije.findUnique({
      where: {
        broj_reklamacije: id,
      },
      select: {
        broj_reklamacije: true,
        datum_prijema: true,
        zemlja_reklamacije: true,
        odgovorna_osoba: true,
        ime_prezime: true,
        adresa: true,
        telefon: true,
        email: true,
        datum_kupovine: true,
        broj_racuna: true,
        naziv_poizvoda: true,
        opis_reklamacije: true,
        datum_odgovora: true,
        opis_odluke: true,
        status_reklamacije: true,
      },
    });

    if (!data) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.status(200).json(data).end();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

module.exports = router;
