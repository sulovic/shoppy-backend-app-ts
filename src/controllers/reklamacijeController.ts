import reklamacijeModel from "../models/reklamacijeModel.js";
import type { Request, Response, NextFunction } from "express";
import { queryParamsSchema, reklamacijaSchema } from "../schemas/schemas.js";
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
      AND: [...andConditions, orConditions.length > 0 ? { OR: orConditions } : {}],
    };

    const reklamacijeData = await reklamacijeModel.getAllReklamacije({
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
      AND: [...andConditions, orConditions.length > 0 ? { OR: orConditions } : {}],
    };

    const reklamacijeCount = await reklamacijeModel.getAllReklamacijeCount({ whereClause });
    return res.status(200).json({ count: reklamacijeCount });
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

    return res.status(200).json({ data: reklamacijaData });
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

    const { komentar: _komentar, smsSent: _smsSent, files: _files, ...reklamacijaPublicData } = reklamacijeData[0];
    res.status(200).json({ data: reklamacijaPublicData });
  } catch (err) {
    next(err);
  }
};

const createReklamacijaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const parsedReklamacija = reklamacijaSchema.omit({ idReklamacije: true }).parse(req.body);

    // convert files null to Prisma.JsonNull
    const prismaParsedReklamacija: Prisma.ReklamacijeCreateInput = { ...parsedReklamacija, files: parsedReklamacija.files ?? Prisma.JsonNull };

    const createdReklamacija = await reklamacijeModel.createReklamacija(prismaParsedReklamacija);

    return res.status(201).json({ message: "Reklamacija created", data: createdReklamacija });
  } catch (err) {
    next(err);
  }
};

const updateReklamacijaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const idReklamacije: number = parseInt(req.params.idReklamacije);

    if (isNaN(idReklamacije)) {
      return res.status(400).json({ message: "Invalid reklamacija ID" });
    }

    const parsedReklamacija = reklamacijaSchema.omit({ idReklamacije: true }).parse(req.body);

    // convert files null to Prisma.JsonNull
    const prismaParsedReklamacija: Prisma.ReklamacijeUpdateInput = { ...parsedReklamacija, files: parsedReklamacija.files ?? Prisma.JsonNull };

    const updatedReklamacija = await reklamacijeModel.updateReklamacija(idReklamacije, prismaParsedReklamacija);

    return res.status(200).json({ message: "Reklamacija updated", data: updatedReklamacija });
  } catch (err) {
    next(err);
  }
};

const deleteReklamacijaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const idReklamacije: number = parseInt(req.params.idReklamacije);

    if (isNaN(idReklamacije)) {
      return res.status(400).json({ message: "Invalid JCI ID" });
    }

    const deletedReklamacija = await reklamacijeModel.deleteReklamacija(idReklamacije);

    return res.status(200).json({ message: "Reklamacija deleted", data: deletedReklamacija });
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
