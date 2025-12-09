import express from "express";
import oAuthGoogleController from "../../controllers/auth/oAuthGoogleController.js";

const router = express.Router();

router.post("/", oAuthGoogleController.handleGoogleLogin);

export default router;
