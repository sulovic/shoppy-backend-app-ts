import type { Request, Response, NextFunction } from "express";

const verifyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Verification successful");
    return res.status(200).json({ message: "Verification successful" });
  } catch (err) {
    next(err);
  }
};

export default verifyController;
