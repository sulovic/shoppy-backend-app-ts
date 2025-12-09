import express from "express";
import oAuthFacebookController from "../../controllers/auth/oAuthFacebookController.js";
const router = express.Router();

router.post("/", oAuthFacebookController.handleFacebookLogin);

export default router;
