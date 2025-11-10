import reklamacijeModel from "../models/reklamacijeModel.ts";
import type { Request, Response, NextFunction } from "express";
import { queryParamsSchema, reklamacijaSchema } from "../schemas/schemas.ts";
import { Prisma, StatusReklamacije } from "../../prisma_clients/reklamacije/client/client.js";

const getAllReklamacijeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { sortBy, sortOrder, limit, page, search, ...filters } = queryParams;

    const take = limit ? parseInt(limit, 10) : undefined;

    const skip = page && limit ? (parseInt(page, 10) - 1) * parseInt(limit, 10) : undefined;

    const orderBy = sortBy ? { [sortBy]: sortOrder || "asc" } : undefined;

    const andKeys = ["idReklamacije"];
    const orKeys: string[] = [];

    const createCondition = (key: string, value: string) => {
      const values = value.split(",").map((v) => (isNaN(Number(v)) ? v : Number(v)));
      return values.length === 1 ? { [key]: values[0] } : { [key]: { in: values } };
    };

    const andConditions: Prisma.ReklamacijeWhereInput[] = andKeys.filter((key) => filters[key]).map((key) => createCondition(key, filters[key]));

    const orConditions: Prisma.ReklamacijeWhereInput[] = orKeys.filter((key) => filters[key]).map((key) => createCondition(key, filters[key]));

    if (search) {
      orConditions.push({ imePrezime: { contains: search } }, { email: { contains: search } }, { telefon: { contains: search } }, { brojRacuna: { contains: search } }, { nazivProizvoda: { contains: search } });
    }

    const whereClause = {
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

    const { sortBy, sortOrder, limit, page, search, ...filters } = queryParams;

    const take = limit ? parseInt(limit, 10) : undefined;

    const skip = page && limit ? (parseInt(page, 10) - 1) * parseInt(limit, 10) : undefined;

    const orderBy = sortBy ? { [sortBy]: sortOrder || "asc" } : undefined;

    const andKeys = ["idReklamacije"];
    const orKeys: string[] = [];

    const createCondition = (key: string, value: string) => {
      const values = value.split(",").map((v) => (isNaN(Number(v)) ? v : Number(v)));
      return values.length === 1 ? { [key]: values[0] } : { [key]: { in: values } };
    };

    const andConditions: Prisma.ReklamacijeWhereInput[] = andKeys.filter((key) => filters[key]).map((key) => createCondition(key, filters[key]));

    const orConditions: Prisma.ReklamacijeWhereInput[] = orKeys.filter((key) => filters[key]).map((key) => createCondition(key, filters[key]));

    if (search) {
      orConditions.push({ imePrezime: { contains: search } }, { email: { contains: search } }, { telefon: { contains: search } }, { brojRacuna: { contains: search } }, { nazivProizvoda: { contains: search } });
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
    const idReklamacije = parseInt(req.params.idReklamacije);

    if (isNaN(idReklamacije)) {
      return res.status(400).json({ message: "Invalid reklamacija ID" });
    }

    const reklamacijaData = await reklamacijeModel.getReklamacija(idReklamacije);

    if (!reklamacijaData) {
      return res.status(404).json({ message: "Reklamacija not found" });
    }

    const { komentar, smsSent, files, ...reklamacijaPublicData } = reklamacijaData;

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
