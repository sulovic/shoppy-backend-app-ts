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

    const data = await prisma.proizvodi.findMany({
      where: filter,
      orderBy,
      take,
      skip,
      include: {
        ProizvodMasaOtpada: {
          include: {
            VrstaOtpada: true,
          },
        },
      },
    });
    res.status(200).json(data).end();
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

    const data = await prisma.proizvodi.findUnique({
      where: {
        id: id,
      },
      include: {
        ProizvodMasaOtpada: {
          include: {
            VrstaOtpada: true,
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

router.post("/", checkUserRole((minRole = 3000)), async (req, res) => {
  try {
    const newProductData = req?.body;

    if (!newProductData) {
      return res.status(400).json({ error: "No data is sent" });
    }

    const data = await prisma.proizvodi.create({
      data: {
        proizvod: newProductData?.proizvod,
        ProizvodMasaOtpada: {
          create: Object.entries(newProductData?.vrsteOtpada).map(([vrstaOtpadaId, masa]) => ({
            VrstaOtpada: { connect: { id: parseInt(vrstaOtpadaId) } },
            masa: parseFloat(masa),
          })),
        },
      },
      include: {
        ProizvodMasaOtpada: {
          include: {
            VrstaOtpada: true,
          },
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

router.put("/:id", checkUserRole((minRole = 3000)), async (req, res) => {
  try {
    const id = parseInt(req?.params?.id);
    const newProductData = req?.body;

    const data = await prisma.proizvodi.update({
      where: {
        id: id,
      },
      data: {
        proizvod: newProductData?.proizvod,
        ProizvodMasaOtpada: {
          upsert: newProductData?.ProizvodMasaOtpada.map((item) => {
            return {
              where: { id: parseInt(item?.id) },
              update: { masa: parseFloat(item?.masa) },
              create: {
                VrstaOtpada: { connect: { id: parseInt(item?.vrsteOtpadaId) } },
                masa: parseFloat(item?.masa),
              },
            };
          }),
        },
      },

      include: {
        ProizvodMasaOtpada: {
          include: {
            VrstaOtpada: true,
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

    const existingData = await prisma.proizvodi.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingData) {
      return res.status(404).json({ error: "Resource not found" });
    }

    //Get related tables data and delete if exists

    const objectForDeletion = await prisma.proizvodi.findUnique({
      where: {
        id: id,
      },
      include: {
        ProizvodMasaOtpada: {
          include: {
            VrstaOtpada: true,
          },
        },
      },
    });

    const deletionPromises = objectForDeletion.ProizvodMasaOtpada.map((item) =>
      prisma.proizvodMasaOtpada.delete({
        where: {
          id: item?.id,
        },
      })
    );

    const data = await prisma.$transaction([
      //delete promises

      ...deletionPromises,

      //delete main entry

      prisma.proizvodi.delete({
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
