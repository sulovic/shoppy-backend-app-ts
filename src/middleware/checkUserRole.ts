import type { Request, Response, NextFunction } from "express";
import priviledgesConfig from "../config/priviledges.js";
import { userDataSchema } from "../schemas/schemas.js";

interface RequestWithAuth extends Request {
  auth?: UserData;
}

const checkUserRole = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  try {
    console.log(req.auth, req.method, req.originalUrl, req.headers["x-original-method"], req.headers["x-original-uri"]);
    if (!req.auth) {
      return res.status(401).json({ error: "Unauthorized - No authUser found" });
    }

    const originalMethod = (req.headers["x-original-method"] as string) || req.method;
    const fullOriginalUri = (req.headers["x-original-uri"] as string) || req.originalUrl;
    const authUser = userDataSchema.parse(req.auth);

    const strippedUri = fullOriginalUri.replace(/^\/api\/v1/, "");

    // Get min role based on path and method, default to 5000

    const segments = strippedUri
      .split("?")[0]
      .split("/")
      .filter((s) => s !== "count") // Ignore count
      .filter((s) => Number.isNaN(parseInt(s))) // Ignore numbers for GET by ID, PUT and DELETE
      .filter((s) => !s.includes(".")) // Ignore files
      .filter(Boolean);

    const currentSubPath = segments[segments.length - 1] || "";

    const minRole = priviledgesConfig[currentSubPath][originalMethod] ?? 5000;

    console.log(`minRole: ${minRole}`, segments, currentSubPath);
    // Verify minimum role condition

    if (authUser.roleId < minRole) {
      return res.status(403).json({ error: "Forbidden - Insufficient privileges" });
    }

    next();
  } catch (error) {
    console.log("Error in checkuserrole middleware", error);
    next(error);
  }
};

export default checkUserRole;
