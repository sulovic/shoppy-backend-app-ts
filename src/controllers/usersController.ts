import userModel from "../models/usersModel.ts";
import type { Request, Response, NextFunction } from "express";
import { queryParamsSchema, userSensitiveDataSchema } from "../schemas/schemas.ts";
import { Prisma } from "../../prisma_clients/users/client/client.js";

const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { sortBy, sortOrder, limit, page, search, filters } = queryParams;

    // default limit to 100 and page to 1 if not provided
    const limitNum = parseInt(limit || "100", 10);
    const pageNum = parseInt(page || "1", 10);

    const take = limitNum;
    const skip = (pageNum - 1) * limitNum;

    const orderBy = sortBy ? { [sortBy]: sortOrder || "desc" } : { ["userId"]: sortOrder || "desc" };

    const andConditions: Prisma.UsersWhereInput[] = [];
    const orConditions: Prisma.UsersWhereInput[] = [];

    const filterKeys = ["roleId"];
    const searchKeys = ["firstName", "lastName", "email"];

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

    const usersSensitiveData = await userModel.getAllUsers({
      whereClause,
      orderBy,
      take,
      skip,
    });

    const usersData: UserData[] = usersSensitiveData.map((user) => {
      return {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
        roleName: user.role.role,
      };
    });

    return res.status(200).json({ data: usersData });
  } catch (err) {
    next(err);
  }
};

const getAllUsersCountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { search, filters } = queryParams;

    const andConditions: Prisma.UsersWhereInput[] = [];
    const orConditions: Prisma.UsersWhereInput[] = [];

    const filterKeys = ["roleId"];
    const searchKeys = ["firstName", "lastName", "email"];

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

    const usersCount = await userModel.getAllUsersCount({ whereClause });
    return res.status(200).json({ count: usersCount });
  } catch (err) {
    next(err);
  }
};

const getUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userSensitiveData = await userModel.getUser(userId);

    if (!userSensitiveData) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const userData: UserData = {
        userId: userSensitiveData.userId,
        firstName: userSensitiveData.firstName,
        lastName: userSensitiveData.lastName,
        email: userSensitiveData.email,
        roleId: userSensitiveData.roleId,
        roleName: userSensitiveData.role.role,
      };

      return res.status(200).json({ data: userData });
    }
  } catch (err) {
    next(err);
  }
};

const createUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { roleId, ...parsedUser } = userSensitiveDataSchema.omit({ userId: true }).parse(req.body);

    const userDataForCreation: Prisma.UsersCreateInput = {
      ...parsedUser,
      role: { connect: { roleId } },
    };

    const createdUserSensitiveData = await userModel.createUser(userDataForCreation);

    const createdUserData: UserData = {
      userId: createdUserSensitiveData.userId,
      firstName: createdUserSensitiveData.firstName,
      lastName: createdUserSensitiveData.lastName,
      email: createdUserSensitiveData.email,
      roleId: createdUserSensitiveData.roleId,
      roleName: createdUserSensitiveData.role.role,
    };

    return res.status(201).json({ message: "User created successfully", data: createdUserData });
  } catch (err) {
    next(err);
  }
};

const updateUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const userId: number = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const { roleId, ...parsedUser } = userSensitiveDataSchema.omit({ userId: true }).parse(req.body);

    const userDataForUpdate: Prisma.UsersUpdateInput = {
      ...parsedUser,
      role: { connect: { roleId } },
    };

    const updatedUserSensitiveData = await userModel.updateUser(userId, userDataForUpdate);

    const updatedUser: UserData = {
      userId: updatedUserSensitiveData.userId,
      firstName: updatedUserSensitiveData.firstName,
      lastName: updatedUserSensitiveData.lastName,
      email: updatedUserSensitiveData.email,
      roleId: updatedUserSensitiveData.roleId,
      roleName: updatedUserSensitiveData.role.role,
    };

    return res.status(200).json({ message: "User updated successfully", data: updatedUser });
  } catch (err) {
    next(err);
  }
};

const deleteUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const userId: number = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const deletedUserSensitiveData = await userModel.deleteUser(userId);

    const deletedUser: UserData = {
      userId: deletedUserSensitiveData.userId,
      firstName: deletedUserSensitiveData.firstName,
      lastName: deletedUserSensitiveData.lastName,
      email: deletedUserSensitiveData.email,
      roleId: deletedUserSensitiveData.roleId,
      roleName: deletedUserSensitiveData.role.role,
    };
    return res.status(200).json({ message: "User deleted successfully", data: deletedUser });
  } catch (err) {
    next(err);
  }
};

export default {
  getAllUsersController,
  getAllUsersCountController,
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
};
