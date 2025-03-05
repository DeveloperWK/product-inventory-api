import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
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

    const pageSize = Number(limit) || 5;
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;

    const filters: {
      price?: { $gte: number; $lte: number };
      category?: Types.ObjectId;

      // stock?: { $gte: number };
    } = {};

    if (typeof min === "string" && typeof max === "string") {
      filters.price = {
        $gte: Number(min),
        $lte: Number(max),
      };
    }

    if (typeof category === "string") {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filters.category = new mongoose.Types.ObjectId(category);
      } else {
        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
          res.status(404).json({ message: "Category not found" });
          return;
        }
        filters.category = categoryDoc._id as Types.ObjectId;
      }
    }
    console.log("filters", filters);

    const productsWithTotalStock = await Product.aggregate([
      {
        $facet: {
          productList: [
            {
              $match: filters,
            },
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categoryDetails",
              },
            },
            {
              $unwind: "$categoryDetails",
            },
            {
              $addFields: {
                categoryName: "$categoryDetails.name",
              },
            },
            {
              $skip: skip,
            },
            {
              $project: {
                _id: 1,
                name: 1,
                stock: 1,
                price: 1,
                categoryName: 1,
              },
            },
            {
              $limit: pageSize,
            },
          ],

          categoryWiseStock: [
            // {
            //   $match: {
            //     stock: { $gt: 0 }, // Apply the same filter
            //   },
            // },
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categoryDetails",
              },
            },
            {
              $unwind: "$categoryDetails",
            },
            {
              $group: {
                _id: "$categoryDetails.name", // Group by category name
                totalStock: { $sum: "$stock" }, // Calculate total stock for the category
              },
            },
            {
              $project: {
                _id: 0, // Remove the default _id field
                categoryName: "$_id", // Use category name as the key
                totalStock: 1,
              },
            },
          ],

          totalStock: [
            // {
            //   $match: {
            //     stock: { $gt: 0 }, // Apply the same filter
            //   },
            // },
            {
              $group: {
                _id: null, // Group all products together
                fullStock: { $sum: "$stock" }, // Calculate total stock
              },
            },
            {
              $project: {
                _id: 0, // Remove the default _id field
                fullStock: 1, // Include only the total stock
              },
            },
          ],
        },
      },
    ]);
    const count = await Product.countDocuments(filters);
    res.status(200).json({
      message: "Products retrieved successfully",
      productsWithTotalStock,
      currentPage,
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
