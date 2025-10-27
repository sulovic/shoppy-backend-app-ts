import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "change-me";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "change-refresh";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Very small example: in a real app verify user via DB
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }

  // Dummy check: accepts any username/password for demo.
  const payload = { sub: username };
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

  return res.json({ accessToken, refreshToken });
};
