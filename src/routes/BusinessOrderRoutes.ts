import { Router } from "express";
import {
  createBusinessOrder,
  deleteBusinessOrder,
  getAllBusinessOrders,
  getBusinessOrderById,
  getBusinessOrdersBySupplier,
  updateBusinessOrder,
} from "../controllers/businessOrderController";

const router = Router();

router.post("", createBusinessOrder);
router.get("", getAllBusinessOrders);
router.get("/:id", getBusinessOrderById);
router.get("/supplier/:supplierId", getBusinessOrdersBySupplier);
router.patch("/:id", updateBusinessOrder);
router.delete("/:id", deleteBusinessOrder);

export default router;
