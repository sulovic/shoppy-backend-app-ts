import express from "express";
import reklamacijeController from "../controllers/reklamacijeController.js";

const router = express.Router();

router.get("/", reklamacijeController.getAllReklamacijeController);
router.get("/count", reklamacijeController.getAllReklamacijeCountController);
router.get("/:idReklamacije", reklamacijeController.getReklamacijaController);
router.post("/", reklamacijeController.createReklamacijaController);
router.put("/:idReklamacije", reklamacijeController.updateReklamacijaController);
router.delete("/:idReklamacije", reklamacijeController.deleteReklamacijaController);

export default router;
