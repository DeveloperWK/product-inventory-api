import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getCashFlowSummary,
  getTransaction,
  getTransactions,
  updateTransaction,
} from "../controllers/cashTransactionController";

const router = Router();

router.post("", createTransaction);
router.get("", getTransactions);
router.get("/summary", getCashFlowSummary);
router.get("/:id", getTransaction);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
