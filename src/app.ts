import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler";
import notFoundMiddleware from "./middlewares/notFoundMiddleware";
import businessOrderRoutes from "./routes/BusinessOrderRoutes";
import cashAccountRoutes from "./routes/cashAccountRoutes";
import cashTransactionRoutes from "./routes/cashTransactionRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import orderRoutes from "./routes/orderRoutes";
import productRoutes from "./routes/productRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import totalCountRoute from "./routes/totalCountRoute";
import userRoutes from "./routes/userRoutes";

const app = express();
// Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  validate: true,
  standardHeaders: true,
});
app.use(limiter);

app.use(
  cors({
    origin: process.env.CLIENT_URI,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/cash-transactions", cashTransactionRoutes);
app.use("/api/v1/cash-accounts", cashAccountRoutes);
app.use("/api/v1/suppliers", supplierRoutes);
app.use("/api/v1/total-counts", totalCountRoute);
app.use("/api/v1/b2b-orders", businessOrderRoutes);

// Middleware
app.use(notFoundMiddleware);
app.use(errorHandler);
export default app;
