import jwt from "jsonwebtoken";
import userModel from "../models/userModel.ts";

export const generateAccessToken = async (user: UserData) => {
  const accessToken: string = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "30m",
  });
  return accessToken;
};

export const generateRefreshToken = async (user: UserData) => {
  const refreshToken: string = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "1d",
  });

  // Save refresh token in database

  await userModel.updateUser(user.userId, {
    refreshToken: refreshToken,
  });

  return refreshToken;
};
