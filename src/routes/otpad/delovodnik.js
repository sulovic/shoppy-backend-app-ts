const { PrismaClient } = require("../../prisma/otpad/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const checkUserRole = require("../../middleware/checkUserRole");
const { Sql } = require("@prisma/client/runtime/library");
const { Prisma } = require("@prisma/client");

router.get("/", checkUserRole((minRole = 1000)), async (req, res) => {
  try {
    // Get query params

    const queryParams = req?.query;
    const { sortBy, sortOrder, limit, page, ...filter } = queryParams;
    const take = limit ? parseInt(limit) : undefined;
    const skip = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;
    const orderBy =
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : undefined;

    const conditions = [];

    if (filter?.godina !== undefined && filter?.godina !== "*") {
      conditions.push(Prisma.sql`YEAR(datum) = ${filter?.godina}`);
    }

    if (filter?.zemlja !== undefined && filter?.zemlja !== "*") {
      conditions.push(Prisma.sql`zemlja = ${filter?.zemlja}`);
    }

    if (filter?.vrstaOtpada !== undefined && filter?.vrstaOtpada !== "*") {
      conditions.push(Prisma.sql`vrstaOtpada = ${filter?.vrstaOtpada}`);
    }

    const whereClause = conditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}` : Prisma.empty;

    const query = Prisma.sql`
    SELECT datum, zemlja, operacija, brojJci, sum(kolicina*masa) AS ukupno, vrstaOtpada FROM JciPodaci 
    JOIN JciProizvodi ON JciPodaci.id = JciProizvodi.jciPodaciId 
    JOIN Proizvodi ON JciProizvodi.proizvodId = Proizvodi.id 
    JOIN ProizvodMasaOtpada ON Proizvodi.id = ProizvodMasaOtpada.proizvodiId
    JOIN VrsteOtpada ON ProizvodMasaOtpada.vrsteOtpadaId = VrsteOtpada.id 
    ${whereClause}
    GROUP BY brojJci, vrstaOtpada
    ORDER BY datum DESC
    `;
    console.log(query);

    const data = await prisma.$queryRaw(query);
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
