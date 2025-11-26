import express from "express";
import logoutController from "../../controllers/auth/logoutController.js";

const router = express.Router();

router.post("/", logoutController);

export default router;
