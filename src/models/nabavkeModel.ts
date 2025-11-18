import { PrismaClient, Prisma } from "../../prisma_clients/nabavke/client/client.js";

const prisma = new PrismaClient();

const getAllPorudzbine = async ({ whereClause, orderBy, take, skip }: { whereClause?: Prisma.PorudzbineWhereInput; orderBy?: Prisma.PorudzbineOrderByWithRelationInput; take?: number; skip?: number }) => {
  return await prisma.porudzbine.findMany({
    where: { ...whereClause },
    orderBy: orderBy,
    take: take,
    skip: skip,
  });
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
  });
};

const createPorudzbina = async (porudzbina: Prisma.PorudzbineCreateInput) => {
  return await prisma.porudzbine.create({
    data: porudzbina,
  });
};

const updatePorudzbina = async (id: number, user: Prisma.PorudzbineUpdateInput) => {
  return await prisma.porudzbine.update({
    where: {
      id,
    },
    data: user,
  });
};

const deletePorudzbina = async (id: number) => {
  //Soft deletion
  return await prisma.porudzbine.delete({
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
};
