import express from "express";
import loginController from "../../controllers/auth/loginController.ts";

const router = express.Router();

router.post("/", loginController);

export default router;
