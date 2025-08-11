import cors from "cors";
import express from "express";
import errorHandler from "./middlewares/errorHandler";
import notFoundMiddleware from "./middlewares/notFoundMiddleware";
import cashAccountRoutes from "./routes/cashAccountRoutes";
import cashFlowRoutes from "./routes/cashFlowRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import orderRoutes from "./routes/orderRoutes";
import productRoutes from "./routes/productRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import totalCountRoute from "./routes/totalCountRoute";
import userRoutes from "./routes/userRoutes";
const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);
app.use(express.json());

// Routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/cash-transactions", cashFlowRoutes);
app.use("/api/v1/cash-account", cashAccountRoutes);
app.use("/api/v1/suppliers", supplierRoutes);
app.use("/api/v1/total-counts", totalCountRoute);

// Middleware
app.use(notFoundMiddleware);
app.use(errorHandler);
export default app;
