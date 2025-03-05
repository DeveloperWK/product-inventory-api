import express, { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/categoryController";
import isAdminMiddleware from "../middlewares/adminMiddleware";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.post("", authMiddleware, isAdminMiddleware, createCategory);
router.get("", getCategories);
router.get("/:id", getCategory);
router.patch("/:id", authMiddleware, isAdminMiddleware, updateCategory);
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteCategory);

export default router;
