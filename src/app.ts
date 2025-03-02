import cors from "cors";
import express from "express";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

export default app;
