import { Router } from "express";
import calculateTotal from "../controllers/totalController";

const router = Router();

router.get("", calculateTotal);
export default router;
