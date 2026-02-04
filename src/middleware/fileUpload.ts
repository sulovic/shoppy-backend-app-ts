import multer from "multer";
import path from "path";
import filesUploadConfig from "../config/filesUploadConfig.js";
import type { Request, Response, NextFunction } from "express";
import fs from "fs/promises";

const UPLOAD_BASE_DIR = "/app/uploads";
const tempUploadDir = path.join(UPLOAD_BASE_DIR, "tmp");

await fs.mkdir(tempUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempUploadDir);
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname
      .replace(/[^a-zA-Z0-9-_.]/g, "") // Remove invalid characters
      .replace(/\s+/g, "_"); // Replace spaces with underscores
    cb(null, sanitizedFileName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: filesUploadConfig.fileSize,
    files: filesUploadConfig.fileCount,
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = Object.keys(filesUploadConfig.allowedFileTypes);
    const allowedMIMETypes = Object.values(filesUploadConfig.allowedFileTypes);

    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    const mime = file.mimetype.toLowerCase();

    const isAllowedExt = allowedExtensions.includes(ext);
    const isAllowedMime = allowedMIMETypes.includes(mime);

    if (isAllowedExt && isAllowedMime) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"));
    }
  },
});

const fileUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subdir = Array.isArray(req.params.path) ? req.params.path.join("/") : req.params.path;

    console.log("Path", req.params.path, "Subdirectory:", subdir);

    if (!subdir || !filesUploadConfig.allowedFolders.includes(subdir)) {
      res.status(400).json({ error: "Subdirectory not allowed." });
      return;
    }

    await new Promise<void>((resolve, reject) => {
      upload.any()(req, res, (err) => (err ? reject(err) : resolve()));
    });

    // Process uploaded files after multer has completed

    const files = req.files as Express.Multer.File[] | undefined;

    if (!files?.length) {
      res.status(400).json({ error: "No files were uploaded." });
      return;
    }

    // Get selected directory

    const finalUploadDir = path.join(UPLOAD_BASE_DIR, subdir);
    await fs.mkdir(finalUploadDir, { recursive: true });

    for (const file of files) {
      const tempFilePath = path.join(tempUploadDir, file.filename);
      const finalFilePath = path.join(finalUploadDir, file.filename);
      await fs.rename(tempFilePath, finalFilePath);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default fileUpload;
