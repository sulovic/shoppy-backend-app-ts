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

    const data = await prisma.vrsteOtpada.findMany({
      where: filter,
      orderBy,
      take,
      skip,
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

    const data = await prisma.vrsteOtpada.findUnique({
      where: {
        id: id,
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

router.post("/", checkUserRole((minRole = 5000)), async (req, res) => {
  try {
    const newVrsta = req?.body;

    if (!newVrsta) {
      return res.status(400).json({ error: "No data is sent" });
    }

    const data = await prisma.vrsteOtpada.create({ data: newVrsta });
    res.status(201).json(data).end();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

router.put("/:id", checkUserRole((minRole = 5000)), async (req, res) => {
  try {
    const id = parseInt(req?.params?.id);

    const data = await prisma.vrsteOtpada.update({
      where: {
        id: id,
      },
      data: req?.body,
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

    const existingData = await prisma.vrsteOtpada.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingData) {
      return res.status(404).json({ error: "Resource not found" });
    }

    //Get related tables data and delete if exists

    const objectForDeletion = await prisma.vrsteOtpada.findUnique({
      where: {
        id: id,
      },
      include: {
        ProizvodMasaOtpada: true,
      },
    });

    const deletionPromises = objectForDeletion.ProizvodMasaOtpada.map((item) =>
      prisma.proizvodMasaOtpada.delete({
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

      prisma.vrsteOtpada.delete({
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
