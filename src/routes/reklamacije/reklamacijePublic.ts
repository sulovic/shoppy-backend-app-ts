import express from "express";
import reklamacijeController from "../../controllers/reklamacijeController.ts";

const router = express.Router();

router.get("/:brojReklamacije", reklamacijeController.getPublicReklamacijaController);

export default router;
