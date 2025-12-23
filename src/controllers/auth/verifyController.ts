import type { Request, Response, NextFunction } from "express";
import filesUploadConfig from "../config/filesUploadConfig.js";

const verifyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const folderPath = (req.headers["x-original-uri"] as string) || "";
    const segments = folderPath.split("/");
    const subdir = segments[2] || null;

    if (!subdir || !filesUploadConfig.allowedFolders.includes(subdir)) {
      return res.status(400).json({ error: "Subdirectory not allowed" });
    }

    return res.status(200).json({ message: "Verification successful" });
  } catch (err) {
    next(err);
  }
};

export default verifyController;
