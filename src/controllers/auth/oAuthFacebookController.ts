// controllers/oauth/facebookController.ts
import type { Request, Response, NextFunction } from "express";
import userModel from "../../models/userModel.ts";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateTokens.ts";
import oAuthProvidersConfig from "../../config/oAuthProviders.ts";

const config = oAuthProvidersConfig.facebook;

const redirectToFacebook = (req: Request, res: Response) => {
  const redirectUri = `${req.protocol}://${req.get("host")}${config.redirectURL}`;
  const url = `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(config.scope)}&response_type=code`;
  res.redirect(url);
};

const handleFacebookCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: "Missing code" });

    // Exchange code for access token
    const tokenResponse = await fetch(`${config.tokenUrl}?client_id=${config.clientId}&client_secret=${config.clientSecret}&redirect_uri=${encodeURIComponent(`${req.protocol}://${req.get("host")}${config.redirectURL}`)}&code=${code}`, {
      method: "GET",
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) return res.status(401).json({ message: "Token exchange failed" });

    // Get user info
    const userRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
    if (!userRes.ok) return res.status(401).json({ message: "Failed to fetch Facebook user info" });

    const userInfo = await userRes.json();
    const email = userInfo.email || `${userInfo.id}@facebook.oauth.local`; // fallback if no email

    // Find user in DB
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

    const accessJwt = generateAccessToken(authUserData);
    const refreshJwt = generateRefreshToken(authUserData);

    return res
      .cookie("refreshToken", refreshJwt, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      })
      .status(200)
      .json({ message: "Login successful", accessToken: accessJwt });
  } catch (err) {
    next(err);
  }
};

export default { redirectToFacebook, handleFacebookCallback };
