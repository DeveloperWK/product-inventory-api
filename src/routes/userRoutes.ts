import express, { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  loginUser,
  updateUser,
} from "../controllers/userController";

const router: Router = express.Router();

router.post("", createUser);
router.post("/login", loginUser);
router.get("", getUsers);

router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
