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

//Vrste otpada routes

router.get("/vrste-otpada", otpadController.vrsteOtpada.getAllVrsteOtpadaController);
router.get("/vrste-otpada/count", otpadController.vrsteOtpada.getAllVrsteOtpadaCountController);
router.get("/vrste-otpada/:id", otpadController.vrsteOtpada.getVrstaOtpadaController);
router.post("/vrste-otpada", otpadController.vrsteOtpada.createVrstaOtpadaController);
router.put("/vrste-otpada/:id", otpadController.vrsteOtpada.updateVrstaOtpadaController);
router.delete("/vrste-otpada/:id", otpadController.vrsteOtpada.deleteVrstaOtpadaController);

export default router;
