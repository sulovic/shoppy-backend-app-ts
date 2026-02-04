import path from "path";
import fs from "fs/promises";
import type { Request, Response, NextFunction } from "express";
import filesUploadConfig from "../config/filesUploadConfig.js";

const uploadController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];

    const filesInfo = files.map((file) => ({
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    }));

    return res.status(200).json({
      message: "Files uploaded successfully",
      files: filesInfo,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { files } = req.body as { files: string[] };
    const subdir = Array.isArray(req.params.path) ? req.params.path.join("/") : req.params.path;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No filenames provided" });
    }

    if (!filesUploadConfig.allowedFolders.includes(subdir)) {
      return res.status(400).json({ error: "Subdirectory not allowed" });
    }

    const UPLOAD_BASE_DIR = "/app/uploads";

    const uploadDir = path.join(UPLOAD_BASE_DIR, subdir);

    if (!uploadDir.startsWith(UPLOAD_BASE_DIR)) {
      return res.status(403).json({ error: "Invalid path sequence" });
    }

    const errors: string[] = [];
    const deletedFiles: string[] = [];

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(uploadDir, path.basename(file));
        try {
          await fs.access(filePath);
          await fs.unlink(filePath);
          deletedFiles.push(file);
        } catch (err: any) {
          if (err.code === "ENOENT") errors.push(`File not found: ${file}`);
          else errors.push(`Error deleting file ${file}: ${err.message}`);
        }
      }),
    );

    if (errors.length > 0) {
      // If there were errors, send them with the successful deletions
      return res.status(400).json({
        message: "Some files were not deleted",
        deletedFiles,
        errors,
      });
    }

    res.status(200).json({
      message: "All files deleted successfully",
      deletedFiles,
    });
  } catch (error) {
    next(error);
  }
};

export { uploadController, deleteFileController };
