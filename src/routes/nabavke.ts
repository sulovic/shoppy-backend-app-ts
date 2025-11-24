import express from "express";
import nabavkeController from "../controllers/nabavkeController.ts";

const router = express.Router();

//Proizvodi routes
router.get("/proizvodi", nabavkeController.proizvodi.getAllProizvodiController);
router.get("/proizvodi/count", nabavkeController.proizvodi.getAllProizvodiCountController);
router.get("/proizvodi/:id", nabavkeController.proizvodi.getProizvodController);
router.post("/proizvodi", nabavkeController.proizvodi.createProizvodController);
router.put("/proizvodi/:id", nabavkeController.proizvodi.updateProizvodController);
router.delete("/proizvodi/:id", nabavkeController.proizvodi.deleteProizvodController);

//Porudzbine routes
router.get("/porudzbine", nabavkeController.porudzbine.getAllPorudzbineController);
router.get("/porudzbine/count", nabavkeController.porudzbine.getAllPorudzbineCountController);
router.get("/porudzbine/:id", nabavkeController.porudzbine.getPorudzbinaController);
router.post("/porudzbine", nabavkeController.porudzbine.createPorudzbinaController);
router.put("/porudzbine/:id", nabavkeController.porudzbine.updatePorudzbinaController);
router.delete("/porudzbine/:id", nabavkeController.porudzbine.deletePorudzbinaController);

export default router;
