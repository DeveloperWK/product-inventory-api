import { Router } from "express";
import {
  createBusinessOrder,
  deleteBusinessOrder,
  getAllBusinessOrders,
  getBusinessOrderById,
  getBusinessOrdersBySupplier,
  updateBusinessOrder,
} from "../controllers/businessOrderController";
import isAdminMiddleware from "../middlewares/adminMiddleware";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("", authMiddleware, isAdminMiddleware, createBusinessOrder);
router.get("", authMiddleware, isAdminMiddleware, getAllBusinessOrders);
router.get("/:id", authMiddleware, isAdminMiddleware, getBusinessOrderById);
router.get(
  "/supplier/:supplierId",
  authMiddleware,
  isAdminMiddleware,
  getBusinessOrdersBySupplier,
);
router.patch("/:id", authMiddleware, isAdminMiddleware, updateBusinessOrder);
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteBusinessOrder);

export default router;
