import { Request, Response } from "express";
import Category from "../models/Category";
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
      product,
    });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, min, max, category } = req.query;
    const categoryName = await Category.findById(category);
    const pageSize = Number(limit) || 5;
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;
    const filters: {
      price?: { $gte: string; $lte: string };
      category?: string;
      stock?: { $gte: string };
    } = {};
    if (typeof category === "string") {
      filters.category = category;
    }
    if (typeof min === "string" && typeof max === "string") {
      filters.price = { $gte: min, $lte: max };
    }
    const totalStock = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalStock: { $sum: "$stock" },
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },

      {
        $project: {
          _id: 0,
          categoryName: "$categoryDetails.name",
          totalStock: 1,
        },
      },
    ]);
    const sum = totalStock.reduce((a, b) => a + b.totalStock, 0);
    const products = await Product.find(filters)
      .skip(skip)
      .limit(pageSize)
      .populate("category", "name -_id")
      .sort({ createdAt: -1 })
      .exec();
    const count = await Product.countDocuments(filters);
    res.status(200).json({
      message: "Products retrieved successfully",
      products,
      count,
      currentPage,
      totalStock,
      totalSum: sum,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
const getProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id)
      .populate("category", "name -_id")
      .exec();
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Product retrieved successfully", product });

    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully", product });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};
const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, stock, description } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        stock,
        description,
      },
      { new: true }
    );
    res.status(202).json({ message: "Product updated successfully", product });
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};

export { createProduct, deleteProduct, getProduct, getProducts, updateProduct };
