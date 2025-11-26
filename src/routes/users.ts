import express from "express";
import userController from "../controllers/usersController.js";

const router = express.Router();

router.get("/", userController.getAllUsersController);
router.get("/count", userController.getAllUsersCountController);
router.get("/:userId", userController.getUserController);
router.post("/", userController.createUserController);
router.put("/:userId", userController.updateUserController);
router.delete("/:userId", userController.deleteUserController);

export default router;
