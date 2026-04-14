// controllers/oauth/githubController.ts
import type { Request, Response, NextFunction } from "express";
import userModel from "../../models/usersModel.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateTokens.js";
import oAuthProvidersConfig from "../../config/oAuthProviders.js";

const config = oAuthProvidersConfig.github;

const handleGithubLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // exchange code for access token
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: "Missing code" });

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
    if (!accessToken) return res.status(401).json({ error: "Token exchange failed" });

    // Get user email

    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const emails = await emailsRes.json();
    const primary = emails.find((e: any) => e.primary && e.verified);
    const email = primary?.email || `${emails[0]?.email || "unknown"}@github.oauth.local`;

    //  Find user in DB and generate tokens
    const { usersSensitiveData, count } = await userModel.getAllUsers({ whereClause: { email } });

    if (count === 0) {
      return res.status(401).json({ error: "Multiple users found" });
    }
    const foundUser = usersSensitiveData[0];
    if (!foundUser) return res.status(401).json({ error: "User not found" });

    const authUserData = {
      userId: foundUser.userId,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      email: foundUser.email,
      roleId: foundUser.roleId,
      roleName: foundUser.role.role,
    };

    const accessJwt = generateAccessToken(authUserData);
    const refreshJwt = await generateRefreshToken(authUserData);

    return res
      .cookie("refreshToken", refreshJwt, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "none",
        path: "/",
      })
      .status(200)
      .json({ message: "Login successful", accessToken: accessJwt });
  } catch (err) {
    next(err);
  }
};

export default { handleGithubLogin };
