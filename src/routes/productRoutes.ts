import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  updateStock,
} from "../controllers/productController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("", authMiddleware, createProduct);
router.get("", getProducts);
router.get("/:id", getProduct);
router.patch("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.patch("/:id/stock", authMiddleware, updateStock);

export default router;
