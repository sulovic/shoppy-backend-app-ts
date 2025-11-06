import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import userModel from "../../models/userModel.ts";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateTokens.ts";

const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: { email: string; password?: string } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    const users = await userModel.getAllUsers({ whereClause: { email } });

    const foundUser = users?.[0];

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid email or user not found" });
    }

    if (!foundUser.passwordHash) {
      return res.status(401).json({ message: "User has no password" });
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const authUserData: UserData = {
      userId: foundUser.userId,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      email: foundUser.email,
      roleId: foundUser.roleId,
      roleName: foundUser.role.role,
    };

    const accessToken = await generateAccessToken(authUserData);
    const refreshToken = await generateRefreshToken(authUserData);

    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      })
      .status(200)
      .json({ message: "Login successful", accessToken });
  } catch (error) {
    next(error);
  }
};

export default loginController;
