import express from "express";
import userController from "../controllers/userController.ts";


const router = express.Router();

//implement check user role

router.get("/", userController.getAllUsersController);
router.get("/count", userController.getAllUsersCountController);
router.get("/:userId", userController.getUserController);
router.post("/", userController.createUserController);
router.put("/:userId", userController.updateUserController);
router.delete("/:userId", userController.deleteUserController);

export default router;
