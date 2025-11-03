import { PrismaClient } from "@prisma/users-client";
import express from "express";
import checkUserRole from "../middleware/checkUserRole.ts";

const prisma = new PrismaClient();

const router = express.Router();

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
      filter[key] = { in: values };
    }

    const data = await prisma.users.findMany({
      where: filter,
      orderBy,
      take,
      skip,
      include: {
        role: true,
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

router.get("/:id", checkUserRole((minRole = 3000)), async (req, res) => {
  try {
    const id = req?.params?.id;

    const data = await prisma.users.findUnique({
      where: {
        email: id,
      },
      include: {
        role: true,
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
    const newUser = req?.body;

    if (!newUser) {
      return res.status(400).json({ error: "No data is sent" });
    }

    const data = await prisma.users.create({ data: newUser });
    await prisma.tokens.create({ data: { email: req?.body?.email } });
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
    const id = req?.params?.id;

    const data = await prisma.users.update({
      where: {
        email: id,
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
    const id = req?.params?.id;

    //Check for resource before deletion

    const existingData = await prisma.users.findUnique({
      where: {
        email: id,
      },
    });

    if (!existingData) {
      return res.status(404).json({ error: "Resource not found" });
    }

    //Delete if exists

    const data = await prisma.users.delete({
      where: {
        email: id,
      },
    });
    await prisma.tokens.delete({
      where: {
        email: id,
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

export default router;
