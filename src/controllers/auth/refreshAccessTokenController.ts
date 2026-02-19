import userModel from "../../models/usersModel.js";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../utils/generateTokens.js";

const refreshAccessTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token not presented" });
    }

    // Verify the token signature

    const decodedRefreshToken: JWTPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

    // Check if the provided refresh token matches the one stored in the database

    const users = await userModel.getAllUsers({ whereClause: { email: decodedRefreshToken.email } });

    const foundUser = users?.[0];

    if (!foundUser) {
      return res.status(401).json({ error: "Invalid user or user not found" });
    }

    if (refreshToken !== foundUser.refreshToken) {
      return res.status(401).json({ error: "Invalid Refresh Token" });
    }

    // Refresh token is valid, issue new access token}

    const authUserData: UserData = {
      userId: foundUser.userId,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      email: foundUser.email,
      roleId: foundUser.roleId,
      roleName: foundUser.role.role,
    };

    const accessToken = generateAccessToken(authUserData);

    return res.status(200).json({ message: "Token refresh successful", accessToken });
  } catch (error) {
    next(error);
  }
};

export default refreshAccessTokenController;
