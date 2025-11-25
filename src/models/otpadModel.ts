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
              id: true,
              proizvod: true,
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
    include: {
      jciProizvodi: {
        select: {
          kolicina: true,
          proizvod: {
            select: {
              id: true,
              proizvod: true,
            },
          },
        },
      },
    },
  });
};

const createJci = async (jci: Prisma.JciPodaciCreateInput) => {
  return await prisma.jciPodaci.create({
    data: jci,
    include: {
      jciProizvodi: {
        select: {
          kolicina: true,
          proizvod: {
            select: {
              id: true,
              proizvod: true,
            },
          },
        },
      },
    },
  });
};

const updateJci = async (id: number, jci: Prisma.JciPodaciUpdateInput) => {
  return await prisma.jciPodaci.update({
    where: {
      id,
    },
    data: jci,
    include: {
      jciProizvodi: {
        select: {
          kolicina: true,
          proizvod: {
            select: {
              id: true,
              proizvod: true,
            },
          },
        },
      },
    },
  });
};

const deleteJci = async (id: number) => {
  return await prisma.jciPodaci.delete({
    where: {
      id,
    },
    include: {
      jciProizvodi: {
        select: {
          kolicina: true,
          proizvod: {
            select: {
              id: true,
              proizvod: true,
            },
          },
        },
      },
    },
  });
};

//Proizvodi models

const getAllProizvodi = async ({ whereClause, orderBy, take, skip }: { whereClause?: Prisma.ProizvodiWhereInput; orderBy?: Prisma.ProizvodiOrderByWithRelationInput; take?: number; skip?: number }) => {
  return await prisma.proizvodi.findMany({
    where: { ...whereClause },
    orderBy: orderBy,
    take: take,
    skip: skip,
    select: {
      ProizvodMasaOtpada: {
        select: {
          masa: true,
          VrstaOtpada: {
            select: {
              vrstaOtpada: true,
            },
          },
        },
      },
    },
  });
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
    select: {
      ProizvodMasaOtpada: {
        select: {
          masa: true,
          VrstaOtpada: {
            select: {
              id: true,
              vrstaOtpada: true,
            },
          },
        },
      },
    },
  });
};

const createProizvod = async (proizvod: Prisma.ProizvodiCreateInput) => {
  return await prisma.proizvodi.create({
    data: proizvod,
    select: {
      ProizvodMasaOtpada: {
        select: {
          masa: true,
          VrstaOtpada: {
            select: {
              id: true,
              vrstaOtpada: true,
            },
          },
        },
      },
    },
  });
};

const updateProizvod = async (id: number, proizvod: Prisma.ProizvodiUpdateInput) => {
  return await prisma.proizvodi.update({
    where: {
      id,
    },
    data: proizvod,
    select: {
      ProizvodMasaOtpada: {
        select: {
          masa: true,
          VrstaOtpada: {
            select: {
              id: true,
              vrstaOtpada: true,
            },
          },
        },
      },
    },
  });
};

const deleteProizvod = async (id: number) => {
  return await prisma.proizvodi.delete({
    where: {
      id,
    },
    select: {
      ProizvodMasaOtpada: {
        select: {
          masa: true,
          VrstaOtpada: {
            select: {
              id: true,
              vrstaOtpada: true,
            },
          },
        },
      },
    },
  });
};

// Vrste otpada models

const getAllVrsteOtpada = async ({ whereClause, orderBy, take, skip }: { whereClause?: Prisma.VrsteOtpadaWhereInput; orderBy?: Prisma.VrsteOtpadaOrderByWithRelationInput; take?: number; skip?: number }) => {
  return await prisma.vrsteOtpada.findMany({
    where: { ...whereClause },
    orderBy: orderBy,
    take: take,
    skip: skip,
    select: {
      id: true,
      vrstaOtpada: true,
    },
  });
};

const getAllVrsteOtpadaCount = async ({ whereClause }: { whereClause?: Prisma.VrsteOtpadaWhereInput }) => {
  return await prisma.vrsteOtpada.count({
    where: { ...whereClause },
    select: {
      id: true,
      vrstaOtpada: true,
    },
  });
};

const getVrstaOtpada = async (id: number) => {
  return await prisma.vrsteOtpada.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      vrstaOtpada: true,
    },
  });
};

const createVrstaOtpada = async (vrstaOtpada: Prisma.VrsteOtpadaCreateInput) => {
  return await prisma.vrsteOtpada.create({
    data: vrstaOtpada,
    select: {
      id: true,
      vrstaOtpada: true,
    },
  });
};

const updateVrstaOtpada = async (id: number, vrstaOtpada: Prisma.VrsteOtpadaUpdateInput) => {
  return await prisma.vrsteOtpada.update({
    where: {
      id,
    },
    data: vrstaOtpada,
    select: {
      id: true,
      vrstaOtpada: true,
    },
  });
};

const deleteVrstaOtpada = async (id: number) => {
  return await prisma.vrsteOtpada.delete({
    where: {
      id,
    },
    select: {
      id: true,
      vrstaOtpada: true,
    },
  });
};

// Delovodnik model

const getDelovodnikModel = async ({ whereSQL }: { whereSQL: Prisma.Sql }) => {
  const query = Prisma.sql`
          SELECT datum, zemlja, operacija, brojJci, sum(kolicina*masa) AS ukupno, vrstaOtpada FROM JciPodaci 
          JOIN JciProizvodi ON JciPodaci.id = JciProizvodi.jciPodaciId 
          JOIN Proizvodi ON JciProizvodi.proizvodId = Proizvodi.id 
          JOIN ProizvodMasaOtpada ON Proizvodi.id = ProizvodMasaOtpada.proizvodiId
          JOIN VrsteOtpada ON ProizvodMasaOtpada.vrsteOtpadaId = VrsteOtpada.id 
          ${whereSQL}
          GROUP BY brojJci, vrstaOtpada
          ORDER BY datum DESC
          `;
  return await prisma.$queryRaw(query);
};

export default {
  jci: { getAllJci, getAllJciCount, getJci, createJci, updateJci, deleteJci },
  proizvodi: { getAllProizvodi, getAllProizvodiCount, getProizvod, createProizvod, updateProizvod, deleteProizvod },
  vrsteOtpada: { getAllVrsteOtpada, getAllVrsteOtpadaCount, getVrstaOtpada, createVrstaOtpada, updateVrstaOtpada, deleteVrstaOtpada },
  delovodnik: { getDelovodnikModel },
};
