import { Request, Response } from "express";
import Category from "../models/Category";

const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(500).send(`All fields are required`);
      return;
    }
    const category = await new Category({
      name,
    }).save();

    res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find();
    const count = await Category.countDocuments();
    res.status(200).json({
      message: "Categories retrieved successfully",
      data: categories,
      count,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const deleteCategory = async () => {};
const updateCategory = async () => {};

export {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
};
