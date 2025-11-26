import express from "express";
import oAuthGoogleController from "../../controllers/auth/oAuthGoogleController.js";

const router = express.Router();

router.get("/", oAuthGoogleController.redirectToGoogle);
router.get("/callback", oAuthGoogleController.handleGoogleCallback);

export default router;
