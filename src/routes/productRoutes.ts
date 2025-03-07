import express, { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController";
import isAdminMiddleware from "../middlewares/adminMiddleware";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.post("", [authMiddleware, isAdminMiddleware], createProduct);
router.get("", getProducts);
router.get("/:id", getProduct);
router.patch("/:id", [authMiddleware, isAdminMiddleware], updateProduct);
router.delete("/:id", [authMiddleware, isAdminMiddleware], deleteProduct);

export default router;
