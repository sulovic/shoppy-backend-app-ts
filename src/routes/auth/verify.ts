import express from "express";
import verifyController from "../../controllers/auth/verifyController.js";

const router = express.Router();

router.get("/", verifyController);

export default router;
