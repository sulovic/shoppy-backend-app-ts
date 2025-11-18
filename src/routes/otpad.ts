import express from "express";
import otpadController from "../controllers/otpadController.ts";

const router = express.Router();

router.get("/jci", otpadController.getAllJciController);
router.get("/jci/count", otpadController.getAllJciCountController);
router.get("/jci/:id", otpadController.getJciController);
router.post("/jci", otpadController.createJciController);

export default router;
