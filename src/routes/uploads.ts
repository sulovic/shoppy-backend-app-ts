import { Router } from "express";
import { deleteFileController, uploadController } from "../controllers/uploadsController.ts";
import fileUpload from "../middleware/fileUpload.ts";
import resizeImage from "../middleware/resizeImage.ts";

const router = Router();

router.post("/:subdir", fileUpload, resizeImage(1000), uploadController);
router.delete("/:subdir", deleteFileController);

export default router;
