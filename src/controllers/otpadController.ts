import otpadModel from "../models/otpadModel.ts";
import type { Request, Response, NextFunction } from "express";
import { queryParamsSchema, JciPodaciSchema } from "../schemas/schemas.ts";
import { Prisma } from "../../prisma_clients/otpad/client/client.js";

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

export default {
  getAllJciController,
};
