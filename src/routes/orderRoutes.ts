import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  updateOrder,
} from "../controllers/OrderController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("", authMiddleware, createOrder);
router.get("", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrder);
router.patch("/:id", authMiddleware, updateOrder);
router.delete("/:id", authMiddleware, deleteOrder);

export default router;
