import { Request, Response, NextFunction } from "express";

interface RequestWithAuth extends Request {
  auth?: UserData;
}

const checkUserRole =
  (minRole = 5000) =>
  async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    try {
      const authUser = req.auth;

      // Verify minimum role condition

      if (!authUser || authUser?.roleId < minRole) {
        return res.status(403).json({ error: "Forbidden - Insufficient privileges" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

export default checkUserRole;
