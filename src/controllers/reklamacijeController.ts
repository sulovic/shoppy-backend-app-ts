import reklamacijeModel from "../models/reklamacijeModel.ts";
import type { Request, Response, NextFunction } from "express";
import { queryParamsSchema, reklamacijaSchema } from "../schemas/schemas.ts";
import { Prisma } from "../../prisma_clients/reklamacije/client/client.js";

const getAllReklamacijeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { sortBy, sortOrder, limit, page, search, filters } = queryParams;

    // default limit to 100 and page to 1 if not provided
    const limitNum = parseInt(limit || "100", 10);
    const pageNum = parseInt(page || "1", 10);

    const take = limitNum;
    const skip = (pageNum - 1) * limitNum;

    const orderBy = sortBy ? { [sortBy]: sortOrder || "desc" } : { ["idReklamacije"]: sortOrder || "desc" };

    const andConditions: Prisma.ReklamacijeWhereInput[] = [];
    const orConditions: Prisma.ReklamacijeWhereInput[] = [];

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

    const whereClause: Prisma.ReklamacijeWhereInput = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const reklamacijeData = await reklamacijeModel.getAllReklamacije({
      whereClause,
      orderBy,
      take,
      skip,
    });

    return res.status(200).json(reklamacijeData);
  } catch (err) {
    next(err);
  }
};

const getAllReklamacijeCountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { search, filters } = queryParams;

    const andConditions: Prisma.ReklamacijeWhereInput[] = [];
    const orConditions: Prisma.ReklamacijeWhereInput[] = [];

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

    const whereClause = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const reklamacijeCount = await reklamacijeModel.getAllReklamacijeCount({ whereClause });
    return res.status(200).json(reklamacijeCount);
  } catch (err) {
    next(err);
  }
};

const getReklamacijaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const idReklamacije = parseInt(req.params.idReklamacije);

    if (isNaN(idReklamacije)) {
      return res.status(400).json({ message: "Invalid reklamacija ID" });
    }

    const reklamacijaData = await reklamacijeModel.getReklamacija(idReklamacije);

    if (!reklamacijaData) {
      return res.status(404).json({ message: "Reklamacija not found" });
    }

    return res.status(200).json(reklamacijaData);
  } catch (err) {
    next(err);
  }
};

const getPublicReklamacijaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const brojReklamacije = req.params.brojReklamacije;

    if (!brojReklamacije) {
      return res.status(400).json({ message: "Invalid Broj reklamacije" });
    }

    const reklamacijeData = await reklamacijeModel.getAllReklamacije({ whereClause: { brojReklamacije } });

    if (!reklamacijeData || reklamacijeData.length != 1) {
      return res.status(404).json({ message: "Reklamacija not found" });
    }

    const { komentar, smsSent, files, ...reklamacijaPublicData } = reklamacijeData[0];

    res.status(200).json(reklamacijaPublicData);
  } catch (err) {
    next(err);
  }
};

const createReklamacijaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const parsedReklamacija: Prisma.ReklamacijeCreateInput = reklamacijaSchema.omit({ idReklamacije: true }).parse(req.body);

    const createdReklamacija = await reklamacijeModel.createReklamacija(parsedReklamacija);

    return res.status(201).json(createdReklamacija);
  } catch (err) {
    next(err);
  }
};

const updateReklamacijaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const idReklamacije: number = parseInt(req.params.idReklamacije);

    const paresedReklamacija: Prisma.ReklamacijeUpdateInput = reklamacijaSchema.omit({ idReklamacije: true }).parse(req.body);

    const updatedReklamacija = await reklamacijeModel.updateReklamacija(idReklamacije, paresedReklamacija);

    return res.status(200).json(updatedReklamacija);
  } catch (err) {
    next(err);
  }
};

const deleteReklamacijaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const idReklamacije: number = parseInt(req.params.idReklamacije);

    const deletedReklamacija = await reklamacijeModel.deleteReklamacija(idReklamacije);

    return res.status(200).json(deletedReklamacija);
  } catch (err) {
    next(err);
  }
};

export default {
  getAllReklamacijeController,
  getAllReklamacijeCountController,
  getReklamacijaController,
  getPublicReklamacijaController,
  createReklamacijaController,
  updateReklamacijaController,
  deleteReklamacijaController,
};
