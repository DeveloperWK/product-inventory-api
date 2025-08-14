import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getCashFlowSummary,
  getTransaction,
  getTransactions,
  updateTransaction,
} from "../controllers/cashTransactionController";
import isAdminMiddleware from "../middlewares/adminMiddleware";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("", authMiddleware, isAdminMiddleware, createTransaction);
router.get("", authMiddleware, isAdminMiddleware, getTransactions);
router.get("/summary", authMiddleware, isAdminMiddleware, getCashFlowSummary);
router.get("/:id", authMiddleware, isAdminMiddleware, getTransaction);
router.patch("/:id", authMiddleware, isAdminMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteTransaction);

export default router;
