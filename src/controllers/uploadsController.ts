import path from "path";
import fs from "fs/promises";
import type { Request, Response, NextFunction } from "express";
import { fileURLToPath } from "url";
import filesUploadConfig from "../config/filesUploadConfig.ts";

const uploadController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];
    const uploadDir = req.body.uploadDir;

    const filesInfo = files.map((file) => ({
      filename: file.filename,
      path: `${uploadDir}/${file.filename}`,
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

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No filenames provided" });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const uploadDir = path.resolve(__dirname, "../public");

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
      })
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
