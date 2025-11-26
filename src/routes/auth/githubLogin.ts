import express from "express";
import oAuthGitHubController from "../../controllers/auth/oAuthGitHubController.js";
const router = express.Router();

router.get("/", oAuthGitHubController.redirectToGitHub);
router.get("/callback", oAuthGitHubController.handleGitHubCallback);

export default router;
