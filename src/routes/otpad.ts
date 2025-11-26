import express from "express";
import otpadController from "../controllers/otpadController.js";

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

//Proizvodi routes
router.get("/proizvodi", otpadController.proizvodi.getAllProizvodiController);
router.get("/proizvodi/count", otpadController.proizvodi.getAllProizvodiCountController);
router.get("/proizvodi/:id", otpadController.proizvodi.getProizvodController);
router.post("/proizvodi", otpadController.proizvodi.createProizvodController);
router.put("/proizvodi/:id", otpadController.proizvodi.updateProizvodController);
router.delete("/proizvodi/:id", otpadController.proizvodi.deleteProizvodController);

// Delovodnik routes
router.get("/delovodnik", otpadController.delovodnik.getDelovodnikController);

export default router;
