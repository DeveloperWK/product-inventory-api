import { Router } from "express";
import {
  createAccount,
  getAccountBalance,
  getAccounts,
  transferFunds,
} from "../controllers/cashAccountController";

const router = Router();

router.post("", createAccount);
router.get("", getAccounts);
router.get("/:id/balance", getAccountBalance);
router.post("/transfer", transferFunds);

export default router;
