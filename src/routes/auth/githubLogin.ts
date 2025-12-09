import express from "express";
import oAuthGitHubController from "../../controllers/auth/oAuthGitHubController.js";
const router = express.Router();

router.post("/", oAuthGitHubController.handleGithubLogin);

export default router;
