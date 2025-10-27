const { PrismaClient } = require("../../prisma/otpad/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const checkUserRole = require("../../middleware/checkUserRole");

router.get("/", checkUserRole((minRole = 1000)), async (req, res) => {
  try {
    // Get query params

    const queryParams = req?.query;
    const { sortBy, sortOrder, limit, page, ...filters } = queryParams;
    const take = limit ? parseInt(limit) : undefined;
    const skip = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;
    const orderBy =
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : undefined;

    const filter = {};

    for (const key in filters) {
      const value = filters[key];
      const values = value.split(",");
      filter[key] = { in: values };
    }

    const data = await prisma.jciPodaci.findMany({
      where: filter,
      orderBy,
      take,
      skip,
      include: {
        jciProizvodi: {
          include: {
            proizvod: {
              include: true,
            },
          },
        },
      },
    });
    const count = await prisma.jciPodaci.count({ where: filter });
    res.status(200).json({data, count});
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

router.get("/:id", checkUserRole((minRole = 1000)), async (req, res) => {
  try {
    const id = parseInt(req?.params?.id);

    const data = await prisma.jciPodaci.findUnique({
      where: {
        id: id,
      },
      include: {
        jciProizvodi: {
          include: {
            proizvod: {
              include: true,
            },
          },
        },
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

router.post("/", checkUserRole((minRole = 1000)), async (req, res) => {
  try {
    const newJci = req?.body;

    if (!newJci) {
      return res.status(400).json({ error: "No data is sent" });
    }

    const data = await prisma.jciPodaci.create({
      data: {
        brojJci: newJci?.brojJci,
        zemlja: newJci?.zemlja,
        datum: newJci?.datum,
        operacija: newJci?.operacija,
        zemlja: newJci?.zemlja,
        jciProizvodi: {
          create: Object.entries(newJci?.jciProizvodi).map(([proizvodId, kolicina]) => ({
            proizvod: { connect: { id: parseInt(proizvodId) } },
            kolicina: parseFloat(kolicina),
          })),
        },
      },
    });
    res.status(201).json(data).end();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

router.put("/:id", checkUserRole((minRole = 1000)), async (req, res) => {
  try {
    const id = parseInt(req?.params?.id);
    const updatedJci = req?.body;

    const data = await prisma.jciPodaci.update({
      where: {
        id: id,
      },
      data: {
        brojJci: updatedJci?.brojJci,
        datum: updatedJci?.datum,
        operacija: updatedJci?.operacija,
        zemlja: updatedJci?.zemlja,
        jciProizvodi: {
          update: updatedJci?.jciProizvodi.map((item) => {
            return {
              where: { id: parseInt(item?.id) },
              data: { kolicina: parseFloat(item?.kolicina) },
            };
          }),
        },
      },

      include: {
        jciProizvodi: {
          include: {
            proizvod: {
              include: true,
            },
          },
        },
      },
    });

    if (!data) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.status(204).json(data).end();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

router.delete("/:id", checkUserRole((minRole = 5000)), async (req, res) => {
  try {
    const id = parseInt(req?.params?.id);

    //Check for resource before deletion

    const existingData = await prisma.jciPodaci.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingData) {
      return res.status(404).json({ error: "Resource not found" });
    }

    //Get related data and delete if exists

    const objectForDeletion = await prisma.jciPodaci.findUnique({
      where: {
        id: id,
      },
      include: {
        jciProizvodi: true,
      },
    });

    const deletionPromises = objectForDeletion.jciProizvodi.map((item) =>
      prisma.jciProizvodi.delete({
        where: {
          id: item?.id,
        },
      })
    );

    //Delete if exists

    const data = await prisma.$transaction([
      //delete promises

      ...deletionPromises,

      //delete main entry

      prisma.jciPodaci.delete({
        where: {
          id: id,
        },
      }),
    ]);
    res.status(204).json(data).end();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

module.exports = router;
