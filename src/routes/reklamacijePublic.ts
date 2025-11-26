import express from "express";
import reklamacijeController from "../controllers/reklamacijeController.js";

const router = express.Router();

router.get("/:brojReklamacije", reklamacijeController.getPublicReklamacijaController);

export default router;
