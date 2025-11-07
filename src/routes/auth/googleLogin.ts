import express from "express";
import oAuthGoogleController from "../../controllers/auth/oAuthGoogleController.ts";

const router = express.Router();

router.get("/", oAuthGoogleController.redirectToGoogle);
router.get("/callback", oAuthGoogleController.handleGoogleCallback);

export default router;
