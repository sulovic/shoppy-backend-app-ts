import type { Request, Response, NextFunction } from "express";
import priviledgesConfig from "../config/priviledges.ts";

interface RequestWithAuth extends Request {
  auth?: UserData;
}

const checkUserRole = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  try {
    const authUser: UserData = req.auth;

    if (!authUser || !authUser?.roleId) {
      return res.status(401).json({ error: "Unauthorized - No authUser found" });
    }

    // Get min role based on path and method, default to 5000

    const path = req.originalUrl.split("?")[0].split("/").filter(Boolean)[0];

    const minRole = priviledgesConfig[path]?.[req.method] || 5000;

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
