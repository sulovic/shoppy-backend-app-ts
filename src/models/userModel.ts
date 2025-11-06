import { PrismaClient, Prisma } from "../../prisma_clients/users/client/client.js";

const prisma = new PrismaClient();

const getAllUsers = async ({ whereClause, orderBy, take, skip }: { whereClause?: Prisma.UsersWhereInput; orderBy?: Prisma.UsersOrderByWithRelationInput; take?: number; skip?: number }) => {
  return await prisma.users.findMany({
    where: { ...whereClause, deleted: false },
    orderBy: orderBy,
    take: take,
    skip: skip,
    include: {
      role: {
        select: {
          role: true,
        },
      },
    },
  });
};

const getAllUsersCount = async ({ whereClause }: { whereClause?: Prisma.UsersWhereInput }) => {
  return await prisma.users.count({
    where: { ...whereClause, deleted: false },
  });
};

const getUser = async (userId: number) => {
  return await prisma.users.findFirst({
    where: {
      userId,
      deleted: false,
    },
    include: {
      role: {
        select: {
          role: true,
        },
      },
    },
  });
};

const createUser = async (user: Prisma.UsersCreateInput) => {
  console.log("In model", user);
  return await prisma.users.create({
    data: user,
    include: {
      role: {
        select: {
          role: true,
        },
      },
    },
  });
};

const updateUser = async (userId: number, user: Prisma.UsersUpdateInput) => {
  return await prisma.users.update({
    where: {
      userId,
      deleted: false,
    },
    data: user,
    include: {
      role: {
        select: {
          role: true,
        },
      },
    },
  });
};

const deleteUser = async (userId: number) => {
  //Soft deletion
  return await prisma.users.update({
    where: {
      userId,
      deleted: false,
    },
    data: {
      deleted: true,
      deletedAt: new Date(),
    },
    include: {
      role: {
        select: {
          role: true,
        },
      },
    },
  });
};

export default {
  getAllUsers,
  getAllUsersCount,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
