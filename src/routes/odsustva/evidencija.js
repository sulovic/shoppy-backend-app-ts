const { PrismaClient } = require("../../prisma/odsustva/client");
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
      filter[key] = key === "odobreno" ? value === "true" : { in: values };
    }

    const data = await prisma.evidencijaOdsustva.findMany({
      where: filter,
      orderBy,
      take,
      skip,
    });
    const count = await prisma.evidencijaOdsustva.count({ where: filter });

    res.status(200).json({data, count}).end();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });

    console.log(err);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

router.get("/:id", checkUserRole((minRole = 1000)), async (req, res) => {
  try {
    const id = parseInt(req?.params?.id);

    const data = await prisma.evidencijaOdsustva.findUnique({
      where: {
        id: parseInt(id),
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
    const newEvent = req?.body;

    if (!newEvent) {
      return res.status(400).json({ error: "No data is sent" });
    }

    const data = await prisma.evidencijaOdsustva.create({ data: newEvent });
    res.status(201).json(data).end();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(err);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

router.put("/:id", checkUserRole((minRole = 1000)), async (req, res) => {
  try {
    const id = parseInt(req?.params?.id);

    const data = await prisma.evidencijaOdsustva.update({
      where: {
        id: parseInt(id),
      },
      data: req?.body,
    });

    if (!data) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.status(204).json(data).end();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
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

    const existingData = await prisma.evidencijaOdsustva.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingData) {
      return res.status(404).json({ error: "Resource not found" });
    }

    //Delete if exists

    const data = await prisma.evidencijaOdsustva.delete({
      where: {
        id: id,
      },
    });
    res.status(204).json(data).end();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(err);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

module.exports = router;
