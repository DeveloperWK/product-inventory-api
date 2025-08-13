import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  updateStock,
} from "../controllers/productController";

const router = Router();

router.post("", createProduct);
router.get("", getProducts);
router.get("/:id", getProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/stock", updateStock); // Special endpoint for stock management

export default router;
