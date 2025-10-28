import { PrismaClient, Users } from "../prisma/users/client/index.js";

const prisma = new PrismaClient();

const getAllUsers = async ({ whereClause, orderBy, take, skip }: { whereClause?: object; orderBy?: object; take?: number; skip?: number }) => {
  return await prisma.users.findMany({
    where: whereClause,
    orderBy: orderBy,
    take: take,
    skip: skip,
  });
};

const getAllUsersCount = async ({ whereClause }: { whereClause?: object }) => {
  return await prisma.users.count({
    where: { ...whereClause, deleted: false },
  });
};

const getUser = async (userId: number) => {
  return await prisma.users.findUnique({
    where: {
      userId,
      deleted: false,
    },
  });
};

const createUser = async (user: Omit<Users, "userId">) => {
  return await prisma.users.create({
    data: {
      user,
    },
  });
};

const updateUser = async (user: Users) => {
  return await prisma.users.update({
    where: {
      userId: user?.userId,
      deleted: false,
    },
    data: {
      user,
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
