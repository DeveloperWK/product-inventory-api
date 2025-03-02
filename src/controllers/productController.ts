import { Request, Response } from "express";
import Product from "../models/Product";

const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const requireFields = ["name", "price", "category", "stock"];
    const missingFields = requireFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      res
        .status(500)
        .send(
          `All fields are required: ${missingFields.join(", ")} are missing`
        );
      return;
    }
    const { name, price, category, stock, description } = req.body;
    const product = await new Product({
      name,
      price,
      category,
      stock,
      description,
    }).save();

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().populate({
      path: "category",
      select: "name -_id",
    });
    const count = await Product.countDocuments();
    res.status(200).json({
      message: "Products retrieved successfully",
      data: products,
      count,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const deleteProduct = async () => {};
const updateProduct = async () => {};

export { createProduct, deleteProduct, getProduct, getProducts, updateProduct };
