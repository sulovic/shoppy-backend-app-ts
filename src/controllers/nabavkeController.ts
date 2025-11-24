import nabavkeModel from "../models/nabavkeModel.ts";
import type { Request, Response, NextFunction } from "express";
import { queryParamsSchema, PorudzbinaSchema, NabavkeProizvodSchema } from "../schemas/schemas.ts";
import { Prisma } from "../../prisma_clients/nabavke/client/client.js";

// Porudzbine controllers
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

    // convert parsedPorudzbina to Prisma object
    const prismaParsedPorudzbina: Prisma.PorudzbineCreateInput = {
      ...parsedPorudzbina,
      files: parsedPorudzbina.files ?? Prisma.JsonNull,
      sadrzaj: { create: parsedPorudzbina.sadrzaj.map((item) => ({ kolicina: item.kolicina, proizvod: { connect: { id: item.proizvod.id } }, cena: item.cena })) },
    };

    const createdPorudzbina = await nabavkeModel.porudzbine.createPorudzbina(prismaParsedPorudzbina);

    return res.status(201).json({ message: "Porudzbina created", data: createdPorudzbina });
  } catch (err) {
    next(err);
  }
};

const updatePorudzbinaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id: number = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID Porudzbine" });
    }

    const parsedPorudzbina = PorudzbinaSchema.omit({ id: true }).parse(req.body);

    // convert parsedPorudzbina to Prisma object
    const prismaParsedPorudzbina: Prisma.PorudzbineUpdateInput = {
      ...parsedPorudzbina,
      files: parsedPorudzbina.files ?? Prisma.JsonNull,
      sadrzaj: {
        deleteMany: {}, // delete all existing items
        create: parsedPorudzbina.sadrzaj.map((item) => ({ kolicina: item.kolicina, proizvod: { connect: { id: item.proizvod.id } }, cena: item.cena })),
      },
    };

    const updatedPorudžbina = await nabavkeModel.porudzbine.updatePorudzbina(id, prismaParsedPorudzbina);

    return res.status(200).json({ message: "Porudžbina updated", data: updatedPorudžbina });
  } catch (err) {
    next(err);
  }
};

const deletePorudzbinaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id: number = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID Porudzbine" });
    }

    const deletedPorudzbina = await nabavkeModel.porudzbine.deletePorudzbina(id);

    return res.status(200).json({ message: "Porudzbina deleted", data: deletedPorudzbina });
  } catch (err) {
    next(err);
  }
};

//Proizvodi controllers

const getAllProizvodiController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { sortBy, sortOrder, limit, page, search, filters } = queryParams;

    // default limit to 100 and page to 1 if not provided
    const limitNum = parseInt(limit || "100", 10);
    const pageNum = parseInt(page || "1", 10);

    const take = limitNum;
    const skip = (pageNum - 1) * limitNum;

    const orderBy = sortBy ? { [sortBy]: sortOrder || "desc" } : { ["id"]: sortOrder || "desc" };

    const andConditions: Prisma.ProizvodiWhereInput[] = [];
    const orConditions: Prisma.ProizvodiWhereInput[] = [];

    const filterKeys: string[] = [];
    const searchKeys = ["naziv", "SKU"];

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

    const whereClause: Prisma.ProizvodiWhereInput = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const proizvodiData = await nabavkeModel.proizvodi.getAllProizvodi({
      whereClause,
      orderBy,
      take,
      skip,
    });

    return res.status(200).json({ data: proizvodiData });
  } catch (err) {
    next(err);
  }
};

const getAllProizvodiCountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { search, filters } = queryParams;

    const andConditions: Prisma.ProizvodiWhereInput[] = [];
    const orConditions: Prisma.ProizvodiWhereInput[] = [];

    const filterKeys: string[] = [];
    const searchKeys = ["naziv", "SKU"];

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

    const proizvodiCount = await nabavkeModel.proizvodi.getAllProizvodiCount({ whereClause });
    return res.status(200).json({ count: proizvodiCount });
  } catch (err) {
    next(err);
  }
};

const getProizvodController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID Proizvoda" });
    }

    const proizvodData = await nabavkeModel.proizvodi.getProizvod(id);

    if (!proizvodData) {
      return res.status(404).json({ message: "Proizvod not found" });
    }

    return res.status(200).json({ data: proizvodData });
  } catch (err) {
    next(err);
  }
};

const createProizvodController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const parsedProizvod = NabavkeProizvodSchema.omit({ id: true }).parse(req.body);

    const createdProizvod = await nabavkeModel.proizvodi.createProizvod(parsedProizvod);

    return res.status(201).json({ message: "Proizvod created", data: createdProizvod });
  } catch (err) {
    next(err);
  }
};

const updateProizvodController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id: number = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID Proizvoda" });
    }

    const parsedProizvod = NabavkeProizvodSchema.omit({ id: true }).parse(req.body);

    const updatedProizvod = await nabavkeModel.proizvodi.updateProizvod(id, parsedProizvod);

    return res.status(200).json({ message: "Proizvod updated", data: updatedProizvod });
  } catch (err) {
    next(err);
  }
};

const deleteProizvodController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id: number = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID Proizvoda" });
    }

    const deletedProizvod = await nabavkeModel.proizvodi.deleteProizvod(id);

    return res.status(200).json({ message: "Proizvod deleted", data: deletedProizvod });
  } catch (err) {
    next(err);
  }
};

export default {
  porudzbine: {
    getAllPorudzbineController,
    getAllPorudzbineCountController,
    getPorudzbinaController,
    createPorudzbinaController,
    updatePorudzbinaController,
    deletePorudzbinaController,
  },
  proizvodi: {
    getAllProizvodiController,
    getAllProizvodiCountController,
    getProizvodController,
    createProizvodController,
    updateProizvodController,
    deleteProizvodController,
  },
};
