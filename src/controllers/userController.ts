import userModel from "../models/userModel.js";
import { Request, Response, NextFunction } from "express";
import { userDataSchema, queryParamsSchema } from "../schemas/schemas";
import { Prisma } from "@prisma/users-client";

const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { sortBy, sortOrder, limit, page, search, ...filters } = queryParams;

    const take = limit ? parseInt(limit, 10) : undefined;

    const skip = page && limit ? (parseInt(page, 10) - 1) * parseInt(limit, 10) : undefined;

    const orderBy = sortBy ? { [sortBy]: sortOrder || "asc" } : undefined;

    const andKeys = ["userId", "roleId"];
    const orKeys: string[] = [];

    const createCondition = (key: string, value: string) => {
      const values = value.split(",").map((v) => (isNaN(Number(v)) ? v : Number(v)));
      return values.length === 1 ? { [key]: values[0] } : { [key]: { in: values } };
    };

    const andConditions: Prisma.UsersWhereInput[] = andKeys.filter((key) => filters[key]).map((key) => createCondition(key, filters[key]));

    const orConditions: Prisma.UsersWhereInput[] = orKeys.filter((key) => filters[key]).map((key) => createCondition(key, filters[key]));

    if (search) {
      orConditions.push({ firstName: { contains: search } }, { lastName: { contains: search } }, { email: { contains: search } });
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

    return res.status(200).json(usersData);
  } catch (err) {
    next(err);
  }
};

const getAllUsersCountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { sortBy, sortOrder, limit, page, search, ...filters } = queryParams;

    const take = limit ? parseInt(limit, 10) : undefined;

    const skip = page && limit ? (parseInt(page, 10) - 1) * parseInt(limit, 10) : undefined;

    const orderBy = sortBy ? { [sortBy]: sortOrder || "asc" } : undefined;

    const andKeys = ["userId", "roleId"];
    const orKeys: string[] = [];

    const createCondition = (key: string, value: string) => {
      const values = value.split(",").map((v) => (isNaN(Number(v)) ? v : Number(v)));
      return values.length === 1 ? { [key]: values[0] } : { [key]: { in: values } };
    };

    const andConditions: Prisma.UsersWhereInput[] = andKeys.filter((key) => filters[key]).map((key) => createCondition(key, filters[key]));

    const orConditions: Prisma.UsersWhereInput[] = orKeys.filter((key) => filters[key]).map((key) => createCondition(key, filters[key]));

    if (search) {
      orConditions.push({ firstName: { contains: search } }, { lastName: { contains: search } }, { email: { contains: search } });
    }

    const whereClause = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const usersCount = await userModel.getAllUsersCount({ whereClause });
    return res.status(200).json(usersCount);
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

      return res.status(200).json(userData);
    }
  } catch (err) {
    next(err);
  }
};

const createUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const parsedUser = userDataSchema.omit({ userId: true }).parse(req.body);
    const createdUserSensitiveData = await userModel.createUser(parsedUser);

    const createdUserData: UserData = {
      userId: createdUserSensitiveData.userId,
      firstName: createdUserSensitiveData.firstName,
      lastName: createdUserSensitiveData.lastName,
      email: createdUserSensitiveData.email,
      roleId: createdUserSensitiveData.roleId,
      roleName: createdUserSensitiveData.role.role,
    };

    return res.status(201).json(createdUserData);
  } catch (err) {
    next(err);
  }
};

const updateUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const parsedUser = userDataSchema.parse(req.body);
    const updatedUserSensitiveData = await userModel.updateUser(parsedUser.userId, parsedUser);

    const updatedUser: UserData = {
      userId: updatedUserSensitiveData.userId,
      firstName: updatedUserSensitiveData.firstName,
      lastName: updatedUserSensitiveData.lastName,
      email: updatedUserSensitiveData.email,
      roleId: updatedUserSensitiveData.roleId,
      roleName: updatedUserSensitiveData.role.role,
    };

    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const deleteUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const userId: number = parseInt(req.params.userId);
    const deletedUserSensitiveData = await userModel.deleteUser(userId);

    const deletedUser: UserData = {
      userId: deletedUserSensitiveData.userId,
      firstName: deletedUserSensitiveData.firstName,
      lastName: deletedUserSensitiveData.lastName,
      email: deletedUserSensitiveData.email,
      roleId: deletedUserSensitiveData.roleId,
      roleName: deletedUserSensitiveData.role.role,
    };
    return res.status(200).json(deletedUser);
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
