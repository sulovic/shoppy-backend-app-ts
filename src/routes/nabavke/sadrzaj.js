const { PrismaClient } = require("../../prisma/nabavke/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const checkUserRole = require("../../middleware/checkUserRole");

router.get("/", checkUserRole((minRole = 3000)), async (req, res) => {
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
      filter[key] = { in: key === "porudzbinaId" ? values.map((val) => parseInt(val)) : values };
    }

    const data = await prisma.sadrzaj.findMany({
      where: filter,
      orderBy,
      take,
      skip,
      include: {
        proizvod: true,
        porudzbina: {
          select: {
            brojKontejnera: true,
            status: true,
          },
        },
      },
    });
    res.status(200).json(data).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

router.get("/:id", checkUserRole((minRole = 3000)), async (req, res) => {
  try {
    const id = parseInt(req?.params?.id);

    const data = await prisma.sadrzaj.findUnique({
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

router.post("/", checkUserRole((minRole = 3000)), async (req, res) => {
  try {
    const newData = req?.body;

    if (!newData) {
      return res.status(400).json({ error: "No data is sent" });
    }

    const data = await prisma.sadrzaj.create({
      data: newData,
    });
    res.status(201).json(data).end();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", err });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

router.put("/:id", checkUserRole((minRole = 3000)), async (req, res) => {
  try {
    const id = parseInt(req?.params?.id);
    const newData = req?.body;

    const data = await prisma.sadrzaj.update({
      where: {
        id: id,
      },
      data: newData,
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

    const existingData = await prisma.sadrzaj.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingData) {
      return res.status(404).json({ error: "Resource not found" });
    }

    //Delete if exists

    const data = await prisma.sadrzaj.delete({
      where: {
        id: id,
      },
    });

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
