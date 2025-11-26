import { Router } from "express";
import { deleteFileController, uploadController } from "../controllers/uploadsController.js";
import fileUpload from "../middleware/fileUpload.js";
import resizeImage from "../middleware/resizeImage.js";

const router = Router();

router.post("/:subdir", fileUpload, resizeImage(1000), uploadController);
router.delete("/:subdir", deleteFileController);

export default router;
