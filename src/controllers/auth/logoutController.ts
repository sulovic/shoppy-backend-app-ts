import type { Request, Response, NextFunction } from "express";
import userModel from "../../models/userModel.ts";
import jwt from "jsonwebtoken";

const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Unauthorized - No Refresh Token presented" });
    }

    //Verify refreshToken

    const refreshTokenVeified: JWTPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

    if (!refreshTokenVeified) {
      return res.status(401).json({ error: "Unauthorized - Invalid Refresh Token" });
    }

    // Delete refreshToken from DB

    await userModel.updateUser(refreshTokenVeified.userId, {
      refreshToken: "",
    });

    // Remove refreshToken httpOnly cookie

    return res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      })
      .status(200)
      .json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

export default logoutController;
