// controllers/oauth/githubController.ts
import type { Request, Response, NextFunction } from "express";
import userModel from "../../models/userModel.ts";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateTokens.ts";
import oAuthProvidersConfig from "../../config/oAuthProviders.ts";

const config = oAuthProvidersConfig.github;

const redirectToGitHub = (req: Request, res: Response) => {
  const redirectUri = `${req.protocol}://${req.get("host")}${config.redirectURL}`;
  const url = `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(config.scope)}`;
  res.redirect(url);
};

const handleGitHubCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // exchange code for access token
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: "Missing code" });

    const tokenResponse = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: `${req.protocol}://${req.get("host")}${config.redirectURL}`,
      }),
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) return res.status(401).json({ message: "Token exchange failed" });

    // Get user email

    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const emails = await emailsRes.json();
    const primary = emails.find((e: any) => e.primary && e.verified);
    const email = primary?.email || `${emails[0]?.email || "unknown"}@github.oauth.local`;

    //  Find user in DB and generate tokens
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

export default { redirectToGitHub, handleGitHubCallback };
