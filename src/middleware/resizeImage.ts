import type { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resizeImage =
    (width: number = 800) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const processImage = async (file: Express.Multer.File) => {
                    if (!file?.originalname || !file.mimetype.startsWith("image/"))
                        throw new Error("File type not allowed");

                    const filePath = path.join(__dirname, "../public", file.originalname);
                    const tempFilePath = path.join(
                        __dirname,
                        "../public",
                        `temp-${file.originalname}`
                    );

                    // Check if image needs resizing
                    const image = sharp(filePath);
                    const metadata = await image.metadata();

                    if (metadata.width && metadata.width <= width) {
                        return;
                    }

                    await image.resize(width).toFile(tempFilePath);

                    // Replace original
                    await fs.rename(tempFilePath, filePath);
                };

                const files = req.files as Express.Multer.File[] | undefined;

                if (files && files.length > 0) {
                    await Promise.allSettled(files.map(processImage));
                }


                next();
            } catch (error) {
                next(error);
            }
        };

export default resizeImage;