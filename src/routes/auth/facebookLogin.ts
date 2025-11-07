import express from "express";
import oAuthFacebookController from "../../controllers/auth/oAuthFacebookController.ts";
const router = express.Router();

router.get("/", oAuthFacebookController.redirectToFacebook);
router.get("/callback", oAuthFacebookController.handleFacebookCallback);

export default router;
