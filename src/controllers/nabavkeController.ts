import nabavkeModel from "../models/nabavkeModel.ts";
import type { Request, Response, NextFunction } from "express";
import { queryParamsSchema, PorudzbinaSchema } from "../schemas/schemas.ts";
import { Prisma } from "../../prisma_clients/nabavke/client/client.js";
import { parse } from "path";
import { connect } from "http2";

const getAllPorudzbineController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { sortBy, sortOrder, limit, page, search, filters } = queryParams;

    // default limit to 100 and page to 1 if not provided
    const limitNum = parseInt(limit || "100", 10);
    const pageNum = parseInt(page || "1", 10);

    const take = limitNum;
    const skip = (pageNum - 1) * limitNum;

    const orderBy = sortBy ? { [sortBy]: sortOrder || "desc" } : { ["id"]: sortOrder || "desc" };

    const andConditions: Prisma.PorudzbineWhereInput[] = [];
    const orConditions: Prisma.PorudzbineWhereInput[] = [];

    const filterKeys = ["status", "zemlja"];
    const searchKeys = ["proFaktura", "dobavljac", "spediter", "brojKontejnera"];

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

    const whereClause: Prisma.PorudzbineWhereInput = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const porudzbineData = await nabavkeModel.porudzbine.getAllPorudzbine({
      whereClause,
      orderBy,
      take,
      skip,
    });

    return res.status(200).json({ data: porudzbineData });
  } catch (err) {
    next(err);
  }
};

const getAllPorudzbineCountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { search, filters } = queryParams;

    const andConditions: Prisma.PorudzbineWhereInput[] = [];
    const orConditions: Prisma.PorudzbineWhereInput[] = [];

    const filterKeys = ["status", "zemlja"];
    const searchKeys = ["proFaktura", "dobavljac", "spediter", "brojKontejnera"];

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

    const porudzbineCount = await nabavkeModel.porudzbine.getAllPorudzbineCount({ whereClause });
    return res.status(200).json({ count: porudzbineCount });
  } catch (err) {
    next(err);
  }
};

const getPorudzbinaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid porudzbina ID" });
    }

    const porudzbinaData = await nabavkeModel.porudzbine.getPorudzbina(id);

    if (!porudzbinaData) {
      return res.status(404).json({ message: "Porudzbina not found" });
    }

    return res.status(200).json({ data: porudzbinaData });
  } catch (err) {
    next(err);
  }
};

const createPorudzbinaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const parsedPorudzbina = PorudzbinaSchema.omit({ id: true }).parse(req.body);

    // convert files null to Prisma.JsonNull
    const prismaParsedPorudzbina: Prisma.PorudzbineCreateInput = { ...parsedPorudzbina, files: parsedPorudzbina.files ?? Prisma.JsonNull, sadrzaj: parsedPorudzbina.sadrzaj.map((sadrzaj) => ({ connect: })) };

    const createdPorudzbina = await nabavkeModel.porudzbine.createPorudzbina(prismaParsedPorudzbina);

    return res.status(201).json({ message: "Porudzbina created", data: createdPorudzbina });
  } catch (err) {
    next(err);
  }
};

const updateReklamacijaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const idReklamacije: number = parseInt(req.params.idReklamacije);

    const parsedReklamacija = reklamacijaSchema.omit({ idReklamacije: true }).parse(req.body);

    // convert files null to Prisma.JsonNull
    const prismaParsedReklamacija: Prisma.ReklamacijeCreateInput = { ...parsedReklamacija, files: parsedReklamacija.files ?? Prisma.JsonNull };

    const updatedReklamacija = await reklamacijeModel.updateReklamacija(idReklamacije, prismaParsedReklamacija);

    return res.status(200).json({ message: "Reklamacija updated", data: updatedReklamacija });
  } catch (err) {
    next(err);
  }
};

const deleteReklamacijaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const idReklamacije: number = parseInt(req.params.idReklamacije);

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
