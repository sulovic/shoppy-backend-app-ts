import otpadModel from "../models/otpadModel.ts";
import type { Request, Response, NextFunction } from "express";
import { queryParamsSchema, JciPodaciSchema } from "../schemas/schemas.ts";
import { Prisma } from "../../prisma_clients/otpad/client/client.js";
import { create } from "domain";

const getAllJciController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { sortBy, sortOrder, limit, page, search, filters } = queryParams;

    // default limit to 100 and page to 1 if not provided
    const limitNum = parseInt(limit || "100", 10);
    const pageNum = parseInt(page || "1", 10);

    const take = limitNum;
    const skip = (pageNum - 1) * limitNum;

    const orderBy = sortBy ? { [sortBy]: sortOrder || "desc" } : { ["id"]: sortOrder || "desc" };

    const andConditions: Prisma.JciPodaciWhereInput[] = [];
    const orConditions: Prisma.JciPodaciWhereInput[] = [];

    const filterKeys = ["zemljaReklamacije", "statusReklamacije", "odgovornaOsoba"];
    const searchKeys = ["brojReklamacije", "imePrezime", "email", "telefon", "adresa", "brojRacuna", "nazivProizvoda"];

    if (filters) {
      for (const key in filters) {
        const value = filters[key];
        if (!filterKeys.includes(key)) {
          return res.status(400).json({ message: `Invalid filter key: ${key}` });
        }

        andConditions.push({ [key]: { in: [value] } });
      }
    }

    if (search) {
      orConditions.push(
        ...searchKeys.map((key) => ({
          [key]: {
            contains: search,
            mode: "insensitive",
          },
        }))
      );
    }

    const whereClause: Prisma.JciPodaciWhereInput = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const reklamacijeData = await otpadModel.jci.getAllJci({
      whereClause,
      orderBy,
      take,
      skip,
    });

    return res.status(200).json({ data: reklamacijeData });
  } catch (err) {
    next(err);
  }
};

const getAllJciCountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { search, filters } = queryParams;

    const andConditions: Prisma.JciPodaciWhereInput[] = [];
    const orConditions: Prisma.JciPodaciWhereInput[] = [];

    const filterKeys = ["zemljaReklamacije", "statusReklamacije", "odgovornaOsoba"];
    const searchKeys = ["brojReklamacije", "imePrezime", "email", "telefon", "adresa", "brojRacuna", "nazivProizvoda"];

    if (filters) {
      for (const key in filters) {
        const value = filters[key];
        if (!filterKeys.includes(key)) {
          return res.status(400).json({ message: `Invalid filter key: ${key}` });
        }

        andConditions.push({ [key]: { in: [value] } });
      }
    }

    if (search) {
      orConditions.push(
        ...searchKeys.map((key) => ({
          [key]: {
            contains: search,
            mode: "insensitive",
          },
        }))
      );
    }

    const whereClause: Prisma.JciPodaciWhereInput = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const jciCount = await otpadModel.jci.getAllJciCount({ whereClause });
    return res.status(200).json({ count: jciCount });
  } catch (err) {
    next(err);
  }
};

const getJciController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid JCI ID" });
    }

    const jciData = await otpadModel.jci.getJci(id);

    if (!jciData) {
      return res.status(404).json({ message: "JCI not found" });
    }

    return res.status(200).json({ data: jciData });
  } catch (err) {
    next(err);
  }
};

const createJciController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    // works only async?
    const parsedJci = JciPodaciSchema.omit({ id: true }).parse(req.body);

    // convert JciPodaci type to Prisma expected format
    const prismaParsedJci: Prisma.JciPodaciCreateInput = {
      ...parsedJci,
      files: parsedJci.files ?? Prisma.JsonNull,
      jciProizvodi: {
        create: parsedJci.jciProizvodi.map((jciProizvod) => ({
          kolicina: jciProizvod.kolicina,
          proizvod: { connect: { id: jciProizvod.proizvod.id } },
        })),
      },
    };

    const createdJci = await otpadModel.jci.createJci(prismaParsedJci);

    return res.status(201).json({ message: "Reklamacija created", data: createdJci });
  } catch (err) {
    next(err);
  }
};

export default {
  getAllJciController,
  getAllJciCountController,
  getJciController,
  createJciController,
};
