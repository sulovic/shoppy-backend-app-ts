import type { Request, Response, NextFunction } from "express";
import priviledgesConfig from "../config/priviledges.js";
import { userDataSchema } from "../schemas/schemas.js";

interface RequestWithAuth extends Request {
  auth?: UserData;
}

const checkUserRole = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ error: "Unauthorized - No authUser found" });
    }

    const originalMethod = (req.headers["x-original-method"] as string) || req.method;
    const authUser = userDataSchema.parse(req.auth);

    // Get min role based on path and method, default to 5000

    const segments = req.originalUrl
      .split("?")[0]
      .split("/")
      .filter((s) => s !== "count") // Ignore count
      .filter((s) => Number.isNaN(parseInt(s))) // Ignore numbers for GET by ID, PUT and DELETE
      .filter(Boolean);

    let current: any = priviledgesConfig;

    for (const segment of segments) {
      current = current?.[segment];
    }

    const minRole = current?.[originalMethod] ?? 5000;

    // Verify minimum role condition

    if (authUser.roleId < minRole) {
      return res.status(403).json({ error: "Forbidden - Insufficient privileges" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default checkUserRole;
