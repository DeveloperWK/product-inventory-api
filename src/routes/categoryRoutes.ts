import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/categoryController";

const router: Router = Router();

// router.post("", authMiddleware, isAdminMiddleware, createCategory);
// router.get("", getCategories);
// router.get("/:id", getCategory);
// router.patch("/:id", authMiddleware, isAdminMiddleware, updateCategory);
// router.delete("/:id", authMiddleware, isAdminMiddleware, deleteCategory);
router.post("", createCategory);
router.get("", getCategories);
router.get("/:id", getCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);
export default router;
