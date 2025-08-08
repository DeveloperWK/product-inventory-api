import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  updateOrder,
} from "../controllers/OrderController";

const router = Router();

router.post("", createOrder);
router.get("", getOrders);
router.get("/:id", getOrder);
router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
