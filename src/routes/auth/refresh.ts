import express from "express";
import refreshAccessTokenController from "../../controllers/auth/refreshAccessTokenController.ts";

const router = express.Router();

router.post("/", refreshAccessTokenController);

export default router;
