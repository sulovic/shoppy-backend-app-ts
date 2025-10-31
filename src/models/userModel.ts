import { PrismaClient, Prisma } from "../prisma/users/client/index.js";

const prisma = new PrismaClient();

const getAllUsers = async ({ whereClause, orderBy, take, skip }: { whereClause?: Prisma.UsersWhereInput; orderBy?: Prisma.UsersOrderByWithRelationInput; take?: number; skip?: number }) => {
  return await prisma.users.findMany({
    where: { ...whereClause, deleted: false },
    orderBy: orderBy,
    take: take,
    skip: skip,
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
  });
};

const createUser = async (user: Prisma.UsersUncheckedCreateInput) => {
  return await prisma.users.create({
    data: user,
  });
};

const updateUser = async (userId: number, user: Prisma.UsersUpdateInput) => {
  return await prisma.users.update({
    where: {
      userId,
      deleted: false,
    },
    data: user,
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
