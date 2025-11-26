import otpadModel from "../models/otpadModel.js";
import type { Request, Response, NextFunction } from "express";
import { queryParamsSchema, JciPodaciSchema, VrstaOtpadaSchema, JciProizvodiSchema } from "../schemas/schemas.js";
import { Prisma } from "../../prisma_clients/otpad/client/client.js";

// JCI Controllers

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

    const filterKeys = ["zemlja", "operacija"];
    const searchKeys = ["brojJci"];

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
      AND: [...andConditions, orConditions.length > 0 ? { OR: orConditions } : {}],
    };

    const jciData = await otpadModel.jci.getAllJci({
      whereClause,
      orderBy,
      take,
      skip,
    });

    return res.status(200).json({ data: jciData });
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

    const filterKeys = ["zemlja", "operacija"];
    const searchKeys = ["brojJci"];

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
      AND: [...andConditions, orConditions.length > 0 ? { OR: orConditions } : {}],
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

    return res.status(201).json({ message: "JCI created", data: createdJci });
  } catch (err) {
    next(err);
  }
};

const updateJciController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id: number = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid JCI ID" });
    }

    const parsedJci = JciPodaciSchema.omit({ id: true }).parse(req.body);

    const prismaParsedJci: Prisma.JciPodaciUpdateInput = {
      ...parsedJci,
      files: parsedJci.files ?? Prisma.JsonNull,
      jciProizvodi: {
        deleteMany: {}, // delete all existing jciProizvodi and replace them
        create: parsedJci.jciProizvodi.map((jp) => ({
          kolicina: jp.kolicina,
          proizvod: { connect: { id: jp.proizvod.id } },
        })),
      },
    };

    const updatedJci = await otpadModel.jci.updateJci(id, prismaParsedJci);

    return res.status(200).json({ message: "JCI updated", data: updatedJci });
  } catch (err) {
    next(err);
  }
};

const deleteJciController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid JCI ID" });
    }

    const deletedJci = await otpadModel.jci.deleteJci(id);

    return res.status(200).json({ message: "JCI deleted", data: deletedJci });
  } catch (err) {
    next(err);
  }
};

// Vrste otpada controllers

const getAllVrsteOtpadaController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { sortBy, sortOrder, limit, page, search, filters } = queryParams;

    // default limit to 100 and page to 1 if not provided
    const limitNum = parseInt(limit || "100", 10);
    const pageNum = parseInt(page || "1", 10);

    const take = limitNum;
    const skip = (pageNum - 1) * limitNum;

    const orderBy = sortBy ? { [sortBy]: sortOrder || "desc" } : { ["id"]: sortOrder || "desc" };

    const andConditions: Prisma.VrsteOtpadaWhereInput[] = [];
    const orConditions: Prisma.VrsteOtpadaWhereInput[] = [];

    const filterKeys: string[] = [];
    const searchKeys = ["vrstaOtpada"];

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

    const whereClause: Prisma.VrsteOtpadaWhereInput = {
      AND: [...andConditions, orConditions.length > 0 ? { OR: orConditions } : {}],
    };

    const vrsteOtpadaData = await otpadModel.vrsteOtpada.getAllVrsteOtpada({
      whereClause,
      orderBy,
      take,
      skip,
    });

    return res.status(200).json({ data: vrsteOtpadaData });
  } catch (err) {
    next(err);
  }
};

const getAllVrsteOtpadaCountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { search, filters } = queryParams;

    const andConditions: Prisma.VrsteOtpadaWhereInput[] = [];
    const orConditions: Prisma.VrsteOtpadaWhereInput[] = [];

    const filterKeys: string[] = [];
    const searchKeys = ["vrstaOtpada"];

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

    const whereClause: Prisma.VrsteOtpadaWhereInput = {
      AND: [...andConditions, orConditions.length > 0 ? { OR: orConditions } : {}],
    };

    const vrsteOtpadaCount = await otpadModel.vrsteOtpada.getAllVrsteOtpadaCount({ whereClause });

    return res.status(200).json({ count: vrsteOtpadaCount });
  } catch (err) {
    next(err);
  }
};

const getVrstaOtpadaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid Vrsta otpada ID" });
    }

    const vrstaOtpada = await otpadModel.vrsteOtpada.getVrstaOtpada(id);

    if (!vrstaOtpada) {
      return res.status(404).json({ message: "Vrsta otpada not found" });
    }

    return res.status(200).json({ data: vrstaOtpada });
  } catch (err) {
    next(err);
  }
};

const createVrstaOtpadaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const parsedVrstaOtpada = VrstaOtpadaSchema.omit({ id: true }).parse(req.body);

    const createdVrstaOtpada = await otpadModel.vrsteOtpada.createVrstaOtpada(parsedVrstaOtpada);

    return res.status(201).json({ data: createdVrstaOtpada });
  } catch (err) {
    next(err);
  }
};

const updateVrstaOtpadaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid Vrsta otpada ID" });
    }

    const parsedVrstaOtpada = VrstaOtpadaSchema.parse(req.body);

    const updatedVrstaOtpada = await otpadModel.vrsteOtpada.updateVrstaOtpada(id, parsedVrstaOtpada);

    return res.status(200).json({ data: updatedVrstaOtpada });
  } catch (err) {
    next(err);
  }
};

const deleteVrstaOtpadaController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid Vrsta otpada ID" });
    }

    const deletedVrstaOtpada = await otpadModel.vrsteOtpada.deleteVrstaOtpada(id);

    return res.status(200).json({ message: "Vrsta otpada deleted", data: deletedVrstaOtpada });
  } catch (err) {
    next(err);
  }
};

// Proizvodi Controllers

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
    const searchKeys = ["proizvod"];

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
      AND: [...andConditions, orConditions.length > 0 ? { OR: orConditions } : {}],
    };

    const proizvodiData = await otpadModel.proizvodi.getAllProizvodi({
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
    const searchKeys = ["proizvod"];

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
      AND: [...andConditions, orConditions.length > 0 ? { OR: orConditions } : {}],
    };

    const proizvodiCount = await otpadModel.proizvodi.getAllProizvodiCount({ whereClause });
    return res.status(200).json({ count: proizvodiCount });
  } catch (err) {
    next(err);
  }
};

const getProizvodController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid Proizvod ID" });
    }

    const proizvodData = await otpadModel.proizvodi.getProizvod(id);

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
    const parsedProizvod = JciProizvodiSchema.omit({ id: true }).parse(req.body);

    // convert JciPodaci type to Prisma expected format

    const prismaParsedProizvod: Prisma.ProizvodiCreateInput = {
      ...parsedProizvod,
      ProizvodMasaOtpada: {
        create: parsedProizvod.ProizvodMasaOtpada.map((proizvodMasaOtpada) => ({
          masa: proizvodMasaOtpada.masa,
          VrstaOtpada: {
            connect: { id: proizvodMasaOtpada.VrstaOtpada.id },
          },
        })),
      },
    };

    const createdProizvod = await otpadModel.proizvodi.createProizvod(prismaParsedProizvod);

    return res.status(201).json({ message: "Proizvod created", data: createdProizvod });
  } catch (err) {
    next(err);
  }
};

const updateProizvodController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id: number = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid Proizvod ID" });
    }

    const parsedProizvod = JciProizvodiSchema.omit({ id: true }).parse(req.body);

    const prismaParsedProizvod: Prisma.ProizvodiUpdateInput = {
      ...parsedProizvod,
      ProizvodMasaOtpada: {
        deleteMany: {},
        create: parsedProizvod.ProizvodMasaOtpada.map((proizvodMasaOtpada) => ({
          masa: proizvodMasaOtpada.masa,
          VrstaOtpada: {
            connect: { id: proizvodMasaOtpada.VrstaOtpada.id },
          },
        })),
      },
    };

    const updatedProizvod = await otpadModel.proizvodi.updateProizvod(id, prismaParsedProizvod);

    return res.status(200).json({ message: "Proizvod updated", data: updatedProizvod });
  } catch (err) {
    next(err);
  }
};

const deleteProizvodController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid Proizvod ID" });
    }

    const deletedProizvod = await otpadModel.proizvodi.deleteProizvod(id);

    return res.status(200).json({ message: "Proizvod deleted", data: deletedProizvod });
  } catch (err) {
    next(err);
  }
};

//Delovodnik controller

const getDelovodnikController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { search, filters } = queryParams;

    console.log(filters);

    const whereClauses: Prisma.Sql[] = [];

    if (search) {
      whereClauses.push(Prisma.sql`"brojJci" ILIKE ${"%" + search + "%"}`);
    }

    if (filters?.godina) {
      whereClauses.push(Prisma.sql`EXTRACT(YEAR FROM "datum") = ${filters.godina}`);
    }

    if (filters?.zemlja) {
      whereClauses.push(Prisma.sql`"zemlja" = ${filters.zemlja}`);
    }

    if (filters?.operacija) {
      whereClauses.push(Prisma.sql`"operacija" = ${filters.operacija}`);
    }

    if (filters?.vrstaOtpada) {
      whereClauses.push(Prisma.sql`"vrstaOtpada" = ${filters.vrstaOtpada}`);
    }

    const whereSQL = whereClauses.length > 0 ? Prisma.sql`WHERE ${Prisma.join(whereClauses, " AND ")}` : Prisma.sql``;

    const delovodnikData = await otpadModel.delovodnik.getDelovodnikModel({ whereSQL });

    return res.status(200).json({ data: delovodnikData });
  } catch (err) {
    next(err);
  }
};

export default {
  jci: {
    getAllJciController,
    getAllJciCountController,
    getJciController,
    createJciController,
    updateJciController,
    deleteJciController,
  },
  vrsteOtpada: {
    getAllVrsteOtpadaController,
    getAllVrsteOtpadaCountController,
    getVrstaOtpadaController,
    createVrstaOtpadaController,
    updateVrstaOtpadaController,
    deleteVrstaOtpadaController,
  },
  proizvodi: {
    getAllProizvodiController,
    getAllProizvodiCountController,
    getProizvodController,
    createProizvodController,
    updateProizvodController,
    deleteProizvodController,
  },
  delovodnik: {
    getDelovodnikController,
  },
};
