import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Products";
import Supplier from "../models/Supplier";

const createSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, contact, paymentTerms } = req.body;

    if (!name || !contact || paymentTerms === undefined) {
      res
        .status(400)
        .json({ message: "Name, contact, and payment terms are required" });
      return;
    }

    const newSupplier = new Supplier({
      ...req.body,
      isActive: req.body.isActive,
    });

    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(500).json({
      message: "Error creating supplier",
      error: (error as Error).message,
    });
  }
};

const getSuppliers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isActive } = req.query;
    const filter: any = {};

    if (isActive) filter.isActive = isActive === "true";

    const suppliers = await Supplier.find(filter).sort({ name: 1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching suppliers",
      error: (error as Error).message,
    });
  }
};

const getSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      res.status(404).json({ message: "Supplier not found" });
      return;
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching supplier",
      error: (error as Error).message,
    });
  }
};

const updateSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSupplier) {
      res.status(404).json({ message: "Supplier not found" });
      return;
    }
    res.json(updatedSupplier);
  } catch (error) {
    res.status(500).json({
      message: "Error updating supplier",
      error: (error as Error).message,
    });
  }
};

const toggleSupplierStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      res.status(404).json({ message: "Supplier not found" });
      return;
    }

    supplier.isActive = !supplier.isActive;
    const updatedSupplier = await supplier.save();

    res.json(updatedSupplier);
  } catch (error) {
    res.status(500).json({
      message: "Error toggling supplier status",
      error: (error as Error).message,
    });
  }
};

const getSupplierProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const products = await Product.find({ supplier: id })
      .select("name sku price quantity reorderLevel")
      .sort({ name: 1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching supplier products",
      error: (error as Error).message,
    });
  }
};

const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const productCount = await Product.countDocuments({
      supplier: req.params.id,
    }).session(session);

    if (productCount > 0) {
      await session.abortTransaction();
      res.status(400).json({
        message: "Cannot delete supplier with associated products",
      });
      return;
    }

    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id, {
      session,
    });

    if (!deletedSupplier) {
      await session.abortTransaction();
      res.status(404).json({ message: "Supplier not found" });
      return;
    }

    await session.commitTransaction();
    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      message: "Error deleting supplier",
      error: (error as Error).message,
    });
  } finally {
    session.endSession();
  }
};
export {
  createSupplier,
  deleteSupplier,
  getSupplier,
  getSupplierProducts,
  getSuppliers,
  toggleSupplierStatus,
  updateSupplier,
};
