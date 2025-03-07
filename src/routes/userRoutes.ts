import express, { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  loginUser,
  updateUser,
} from "../controllers/userController";
import isAdminMiddleware from "../middlewares/adminMiddleware";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("", authMiddleware, isAdminMiddleware, getUsers);

router.get("/:id", authMiddleware, getUser);
router.patch("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
