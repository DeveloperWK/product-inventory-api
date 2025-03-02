import express, { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/categoryController";

const router: Router = express.Router();

router.post("", createCategory);
router.get("", getCategories);
router.get("/:id", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
