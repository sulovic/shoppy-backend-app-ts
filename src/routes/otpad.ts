import express from "express";
import otpadController from "../controllers/otpadController.ts";

const router = express.Router();

//JCI routes
router.get("/jci", otpadController.jci.getAllJciController);
router.get("/jci/count", otpadController.jci.getAllJciCountController);
router.get("/jci/:id", otpadController.jci.getJciController);
router.post("/jci", otpadController.jci.createJciController);
router.put("/jci/:id", otpadController.jci.updateJciController);
router.delete("/jci/:id", otpadController.jci.deleteJciController);

export default router;
