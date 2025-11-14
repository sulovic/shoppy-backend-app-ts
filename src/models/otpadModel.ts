import { PrismaClient, Prisma } from "../../prisma_clients/otpad/client/client.js";

const prisma = new PrismaClient();

// JCI models

const getAllJci = async ({ whereClause, orderBy, take, skip }: { whereClause?: Prisma.JciPodaciWhereInput; orderBy?: Prisma.JciPodaciOrderByWithRelationInput; take?: number; skip?: number }) => {
  return await prisma.jciPodaci.findMany({
    where: { ...whereClause },
    orderBy: orderBy,
    take: take,
    skip: skip,
    include: {
      jciProizvodi: {
        select: {
          kolicina: true,
          proizvod: {
            select: {
              proizvod: true,
              ProizvodMasaOtpada: {
                select: {
                  VrstaOtpada: {
                    select: {
                      vrstaOtpada: true,
                    },
                  },
                  masa: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

const getAllJciCount = async ({ whereClause }: { whereClause?: Prisma.JciPodaciWhereInput }) => {
  return await prisma.jciPodaci.count({
    where: { ...whereClause },
  });
};

const getJci = async (id: number) => {
  return await prisma.jciPodaci.findUnique({
    where: {
      id,
    },
  });
};

const createJci = async (jci: Prisma.JciPodaciCreateInput) => {
  return await prisma.jciPodaci.create({
    data: jci,
  });
};

const updateJci = async (id: number, jci: Prisma.JciPodaciUpdateInput) => {
  return await prisma.jciPodaci.update({
    where: {
      id,
    },
    data: jci,
  });
};

const deleteJci = async (id: number) => {
  return await prisma.jciPodaci.delete({
    where: {
      id,
    },
  });
};

//Proizvodi models

const getAllProizvodi = async ({ whereClause, orderBy, take, skip }: { whereClause?: Prisma.JciProizvodiWhereInput; orderBy?: Prisma.JciProizvodiOrderByWithRelationInput; take?: number; skip?: number }) => {
  return await prisma.jciProizvodi.findMany({
    where: { ...whereClause },
    orderBy: orderBy,
    take: take,
    skip: skip,
  });
};

const getAllProizvodiCount = async ({ whereClause }: { whereClause?: Prisma.JciProizvodiWhereInput }) => {
  return await prisma.jciProizvodi.count({
    where: { ...whereClause },
  });
};

const getProizvod = async (id: number) => {
  return await prisma.jciProizvodi.findUnique({
    where: {
      id,
    },
  });
};

const createProizvod = async (proizvod: Prisma.JciProizvodiCreateInput) => {
  return await prisma.jciProizvodi.create({
    data: proizvod,
  });
};

const updateProizvod = async (id: number, proizvod: Prisma.JciProizvodiUpdateInput) => {
  return await prisma.jciProizvodi.update({
    where: {
      id,
    },
    data: proizvod,
  });
};

const deleteProizvod = async (id: number) => {
  return await prisma.jciProizvodi.delete({
    where: {
      id,
    },
  });
};

// Vrste otpada models

const getVrsteOtpada = async ({ whereClause, orderBy, take, skip }: { whereClause?: Prisma.VrsteOtpadaWhereInput; orderBy?: Prisma.VrsteOtpadaOrderByWithRelationInput; take?: number; skip?: number }) => {
  return await prisma.vrsteOtpada.findMany({
    where: { ...whereClause },
    orderBy: orderBy,
    take: take,
    skip: skip,
  });
};

const getVrsteOtpadaCount = async ({ whereClause }: { whereClause?: Prisma.VrsteOtpadaWhereInput }) => {
  return await prisma.vrsteOtpada.count({
    where: { ...whereClause },
  });
};

const getVrstaOtpada = async (id: number) => {
  return await prisma.vrsteOtpada.findUnique({
    where: {
      id,
    },
  });
};

const createVrstaOtpada = async (vrstaOtpada: Prisma.VrsteOtpadaCreateInput) => {
  return await prisma.vrsteOtpada.create({
    data: vrstaOtpada,
  });
};

const updateVrstaOtpada = async (id: number, vrstaOtpada: Prisma.VrsteOtpadaUpdateInput) => {
  return await prisma.vrsteOtpada.update({
    where: {
      id,
    },
    data: vrstaOtpada,
  });
};

const deleteVrstaOtpada = async (id: number) => {
  return await prisma.vrsteOtpada.delete({
    where: {
      id,
    },
  });
};

export default {
  jci: { getAllJci, getAllJciCount, getJci, createJci, updateJci, deleteJci },
  proizvodi: { getAllProizvodi, getAllProizvodiCount, getProizvod, createProizvod, updateProizvod, deleteProizvod },
  vrsteOtpada: { getVrsteOtpada, getVrsteOtpadaCount, getVrstaOtpada, createVrstaOtpada, updateVrstaOtpada, deleteVrstaOtpada },
};
