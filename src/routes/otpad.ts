import express from "express";
import otpadController from "../controllers/otpadController.ts";

const router = express.Router();

router.get("/jci", otpadController.getAllJciController);

export default router;
