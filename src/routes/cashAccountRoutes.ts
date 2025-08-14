import { Router } from "express";
import {
  createAccount,
  getAccountBalance,
  getAccounts,
  transferFunds,
} from "../controllers/cashAccountController";
import isAdminMiddleware from "../middlewares/adminMiddleware";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("", authMiddleware, isAdminMiddleware, createAccount);
router.get("", authMiddleware, isAdminMiddleware, getAccounts);
router.get(
  "/:id/balance",
  authMiddleware,
  isAdminMiddleware,
  getAccountBalance,
);
router.post("/transfer", authMiddleware, isAdminMiddleware, transferFunds);

export default router;
