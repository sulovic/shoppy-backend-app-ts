import { PrismaClient, Prisma } from "../../prisma_clients/reklamacije/client/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_REKLAMACIJE_URL,
});

const prisma = new PrismaClient({ adapter });

const getAllReklamacije = async ({ whereClause, orderBy, take, skip }: { whereClause?: Prisma.ReklamacijeWhereInput; orderBy?: Prisma.ReklamacijeOrderByWithRelationInput; take?: number; skip?: number }) => {
  const [reklamacije, count] = await prisma.$transaction([
    prisma.reklamacije.findMany({
      where: { ...whereClause },
      orderBy: orderBy,
      take: take,
      skip: skip,
    }),
    prisma.reklamacije.count({
      where: { ...whereClause },
    }),
  ]);
  return { reklamacije, count };
};

const getAllReklamacijeCount = async ({ whereClause }: { whereClause?: Prisma.ReklamacijeWhereInput }) => {
  return await prisma.reklamacije.count({
    where: { ...whereClause },
  });
};

const getReklamacija = async (idReklamacije: number) => {
  return await prisma.reklamacije.findUnique({
    where: {
      idReklamacije,
    },
  });
};

const createReklamacija = async (reklamacija: Prisma.ReklamacijeCreateInput) => {
  return await prisma.reklamacije.create({
    data: reklamacija,
  });
};

const updateReklamacija = async (idReklamacije: number, reklamacija: Prisma.ReklamacijeUpdateInput) => {
  return await prisma.reklamacije.update({
    where: {
      idReklamacije,
    },
    data: reklamacija,
  });
};

const deleteReklamacija = async (idReklamacije: number) => {
  return await prisma.reklamacije.delete({
    where: {
      idReklamacije,
    },
  });
};

export default {
  getAllReklamacije,
  getAllReklamacijeCount,
  getReklamacija,
  createReklamacija,
  updateReklamacija,
  deleteReklamacija,
};
