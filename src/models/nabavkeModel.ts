import { PrismaClient, Prisma } from "../../prisma_clients/nabavke/client/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_NABAVKE_URL,
});

const prisma = new PrismaClient({ adapter });

const getAllPorudzbine = async ({ whereClause, orderBy, take, skip }: { whereClause?: Prisma.PorudzbineWhereInput; orderBy?: Prisma.PorudzbineOrderByWithRelationInput; take?: number; skip?: number }) => {
  const [porudzbine, count] = await prisma.$transaction([
    prisma.porudzbine.findMany({
      where: { ...whereClause },
      orderBy: orderBy,
      take: take,
      skip: skip,
      include: {
        sadrzaj: {
          select: {
            id: true,
            cena: true,
            kolicina: true,
            proizvod: {
              select: {
                id: true,
                naziv: true,
                SKU: true,
              },
            },
          },
        },
      },
    }),
    prisma.porudzbine.count({
      where: { ...whereClause },
    }),
  ]);

  return { porudzbine, count };
};

const getAllPorudzbineCount = async ({ whereClause }: { whereClause?: Prisma.PorudzbineWhereInput }) => {
  return await prisma.porudzbine.count({
    where: { ...whereClause },
  });
};

const getPorudzbina = async (id: number) => {
  return await prisma.porudzbine.findUnique({
    where: {
      id,
    },
    include: {
      sadrzaj: {
        select: {
          id: true,
          cena: true,
          kolicina: true,
          proizvod: {
            select: {
              id: true,
              naziv: true,
              SKU: true,
            },
          },
        },
      },
    },
  });
};

const createPorudzbina = async (porudzbina: Prisma.PorudzbineCreateInput) => {
  return await prisma.porudzbine.create({
    data: porudzbina,
    include: {
      sadrzaj: {
        select: {
          id: true,
          cena: true,
          kolicina: true,
          proizvod: {
            select: {
              id: true,
              naziv: true,
              SKU: true,
            },
          },
        },
      },
    },
  });
};

const updatePorudzbina = async (id: number, porudzbina: Prisma.PorudzbineUpdateInput) => {
  return await prisma.porudzbine.update({
    where: {
      id,
    },
    data: porudzbina,
    include: {
      sadrzaj: {
        select: {
          id: true,
          cena: true,
          kolicina: true,
          proizvod: {
            select: {
              id: true,
              naziv: true,
              SKU: true,
            },
          },
        },
      },
    },
  });
};

const deletePorudzbina = async (id: number) => {
  return await prisma.porudzbine.delete({
    where: {
      id,
    },
    include: {
      sadrzaj: {
        select: {
          id: true,
          cena: true,
          kolicina: true,
          proizvod: {
            select: {
              id: true,
              naziv: true,
              SKU: true,
            },
          },
        },
      },
    },
  });
};

const getAllProizvodi = async ({ whereClause, orderBy, take, skip }: { whereClause?: Prisma.ProizvodiWhereInput; orderBy?: Prisma.ProizvodiOrderByWithRelationInput; take?: number; skip?: number }) => {
  const [proizvodi, count] = await prisma.$transaction([
    prisma.proizvodi.findMany({
      where: { ...whereClause },
      orderBy: orderBy,
      take: take,
      skip: skip,
    }),
    prisma.proizvodi.count({
      where: { ...whereClause },
    }),
  ]);

  return { proizvodi, count };
};

const getAllProizvodiCount = async ({ whereClause }: { whereClause?: Prisma.ProizvodiWhereInput }) => {
  return await prisma.proizvodi.count({
    where: { ...whereClause },
  });
};

const getProizvod = async (id: number) => {
  return await prisma.proizvodi.findUnique({
    where: {
      id,
    },
  });
};

const createProizvod = async (proizvod: Prisma.ProizvodiCreateInput) => {
  return await prisma.proizvodi.create({
    data: proizvod,
  });
};

const updateProizvod = async (id: number, proizvod: Prisma.ProizvodiUpdateInput) => {
  return await prisma.proizvodi.update({
    where: {
      id,
    },
    data: proizvod,
  });
};

const deleteProizvod = async (id: number) => {
  return await prisma.proizvodi.delete({
    where: {
      id,
    },
  });
};

export default {
  porudzbine: {
    getAllPorudzbine,
    getAllPorudzbineCount,
    getPorudzbina,
    createPorudzbina,
    updatePorudzbina,
    deletePorudzbina,
  },
  proizvodi: {
    getAllProizvodi,
    getAllProizvodiCount,
    getProizvod,
    createProizvod,
    updateProizvod,
    deleteProizvod,
  },
};
