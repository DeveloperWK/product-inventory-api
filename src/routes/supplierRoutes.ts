import express from "express";
import {
  createSupplier,
  deleteSupplier,
  getSupplier,
  getSupplierProducts,
  getSuppliers,
  toggleSupplierStatus,
  updateSupplier,
} from "../controllers/supplierController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("", authMiddleware, createSupplier);
router.get("", authMiddleware, getSuppliers);
router.get("/:id", authMiddleware, getSupplier);
router.get("/:id/products", authMiddleware, getSupplierProducts);
router.patch("/:id", authMiddleware, updateSupplier);
router.patch("/:id/status", authMiddleware, toggleSupplierStatus);
router.delete("/:id", authMiddleware, deleteSupplier);

export default router;
