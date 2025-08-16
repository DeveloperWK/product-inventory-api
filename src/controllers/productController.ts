import { Request, Response } from "express";
import Product, { IProduct } from "../models/Products";

const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, sku, price, cost, stock } = req.body;

    if (!name || !sku || !price || !cost || stock === undefined) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const newProduct: IProduct = new Product({
      name,
      sku,
      price,
      cost,
      stock,
      category: req.body.category,
      reorderLevel: req.body.reorderLevel,
      supplier: req.body.supplier,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: "SKU must be unique" });
      return;
    }
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, minPrice, maxPrice, lowStock } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (lowStock === "true") {
      filter.$expr = { $lt: ["$stock", "$reorderLevel"] };
    }

    const products = await Product.find(filter).populate(
      "supplier",
      "-_id name",
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: (error as Error).message,
    });
  }
};

const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("supplier");

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: (error as Error).message,
    });
  }
};

const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const updates = req.body;
    const { id } = req.params;
    if (updates.sku) {
      res.status(400).json({ message: "SKU cannot be modified" });
      return;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      runValidators: true,
    }).populate("supplier");

    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: (error as Error).message,
    });
  }
};

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: (error as Error).message,
    });
  }
};

const updateStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { action, stock } = req.body;
    const { id } = req.params;
    if (!["increment", "decrement", "set"].includes(action) || !stock) {
      res.status(400).json({ message: "Invalid action or stock" });
      return;
    }

    const product: IProduct | null = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    let updateQuery = {};
    switch (action) {
      case "increment":
        updateQuery = { $inc: { stock } };
        break;
      case "decrement":
        if (product.stock < stock) {
          res.status(400).json({ message: "Insufficient stock" });
          return;
        }
        updateQuery = { $inc: { stock: -stock } };
        break;
      case "set":
        updateQuery = { $set: { stock } };
        break;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Error updating stock",
      error: (error as Error).message,
    });
  }
};
export {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  updateStock,
};
