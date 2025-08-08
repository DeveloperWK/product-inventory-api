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

const router = express.Router();

router.post("", createSupplier);
router.get("", getSuppliers);
router.get("/:id", getSupplier);
router.get("/:id/products", getSupplierProducts);
router.patch("/:id", updateSupplier);
router.patch("/:id/status", toggleSupplierStatus);
router.delete("/:id", deleteSupplier);

export default router;
