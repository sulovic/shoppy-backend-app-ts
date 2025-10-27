import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "change-me";

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"] as string | undefined;
  if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ error: "Invalid Authorization format" });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    // attach payload if needed
    (req as any).user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default verifyAccessToken;
