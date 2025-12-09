// controllers/oauth/googleController.ts
import type { Request, Response, NextFunction } from "express";
import userModel from "../../models/usersModel.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateTokens.js";
import oAuthProvidersConfig from "../../config/oAuthProviders.js";
import jwt from "jsonwebtoken";

const config = oAuthProvidersConfig.google;

const handleGoogleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // exchange code for access token

    const { code } = req.query;
    if (!code) return res.status(400).json({ message: "Missing code" });

    const tokenResponse = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code as string,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: `${req.protocol}://${req.get("host")}${config.redirectURL}`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    const idToken = tokenData.id_token;

    if (!idToken) return res.status(401).json({ message: "Token exchange failed" });

    //  Find user in DB and generate tokens

    const decodedIdToken: any = jwt.decode(idToken);
    const email = decodedIdToken.email;

    const users = await userModel.getAllUsers({ whereClause: { email } });
    const foundUser = users[0];
    if (!foundUser) return res.status(401).json({ message: "User not found" });

    const authUserData = {
      userId: foundUser.userId,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      email: foundUser.email,
      roleId: foundUser.roleId,
      roleName: foundUser.role.role,
    };

    const accessToken = generateAccessToken(authUserData);
    const refreshToken = generateRefreshToken(authUserData);

    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "none",
        path: "/",
      })
      .status(200)
      .json({ message: "Login successful", accessToken });
  } catch (err) {
    next(err);
  }
};

export default { handleGoogleLogin };
