import cors from "cors";
import express from "express";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler";
import notFoundMiddleware from "./middlewares/notFoundMiddleware";
import businessOrderRoutes from "./routes/BusinessOrderRoutes";
import cashAccountRoutes from "./routes/cashAccountRoutes";
import cashFlowRoutes from "./routes/cashTransactionRoutes";
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

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/cash-transactions", cashFlowRoutes);
app.use("/api/v1/cash-account", cashAccountRoutes);
app.use("/api/v1/suppliers", supplierRoutes);
app.use("/api/v1/total-counts", totalCountRoute);
app.use("/api/v1/business-orders", businessOrderRoutes);

// Middleware
app.use(notFoundMiddleware);
app.use(errorHandler);
export default app;
