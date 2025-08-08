// import express, { Router } from "express";
// import {
//   createProduct,
//   deleteProduct,
//   getProduct,
//   getProducts,
//   updateProduct,
// } from "../controllers/productController";
// import isAdminMiddleware from "../middlewares/adminMiddleware";
// import authMiddleware from "../middlewares/authMiddleware";

// const router: Router = express.Router();

// router.post("", [authMiddleware, isAdminMiddleware], createProduct);
// router.get("", getProducts);
// router.get("/:id", getProduct);
// router.patch("/:id", [authMiddleware, isAdminMiddleware], updateProduct);
// router.delete("/:id", [authMiddleware, isAdminMiddleware], deleteProduct);

// export default router;
import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  updateStock,
} from "../controllers/productController";

const router = Router();

router.post("", createProduct);
router.get("", getProducts);
router.get("/:id", getProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/stock", updateStock); // Special endpoint for stock management

export default router;
