import { Request, Response } from "express";
import mongoose from "mongoose";
import BusinessOrder from "../models/BusinessOrder";

const createBusinessOrder = async (req: Request, res: Response) => {
  try {
    const {
      name,
      supplier,
      date,
      due,
      payment,
      total,
      discount,
      relatedTransactions,
    } = req.body;

    const newBusinessOrder = new BusinessOrder({
      name,
      supplier,
      date: date || new Date().toISOString(),
      due: due,
      payment,
      total,
      discount,
      relatedTransactions: relatedTransactions || [],
    });

    const savedBusinessOrder = await newBusinessOrder.save();

    const populatedOrder = await BusinessOrder.findById(savedBusinessOrder._id)
      .populate("supplier", "name")
      .populate("relatedTransactions");

    res.status(201).json({
      success: true,
      message: "Business order created successfully",
      data: populatedOrder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating business order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getAllBusinessOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, supplier } = req.query;

    const filter: any = {};
    if (supplier) {
      filter.supplier = supplier;
    }

    const businessOrders = await BusinessOrder.find(filter)
      .populate("supplier", "name")
      .populate("relatedTransactions")
      .limit(limit as number)
      .skip(((page as number) - 1) * (limit as number))
      .sort({ date: -1 });

    const total = await BusinessOrder.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Business orders retrieved successfully",
      data: businessOrders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / (limit as number)),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving business orders",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getBusinessOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid business order ID",
      });
    }

    const businessOrder = await BusinessOrder.findById(id)
      .populate("supplier", "name")
      .populate("relatedTransactions");

    if (!businessOrder) {
      return res.status(404).json({
        success: false,
        message: "Business order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Business order retrieved successfully",
      data: businessOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving business order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateBusinessOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid business order ID",
      });
    }

    delete updateData._id;
    delete updateData.__v;

    const updatedBusinessOrder = await BusinessOrder.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedBusinessOrder) {
      return res.status(404).json({
        success: false,
        message: "Business order not found",
      });
    }

    const populatedOrder = await BusinessOrder.findById(
      updatedBusinessOrder._id,
    )
      .populate("supplier", "name")
      .populate("relatedTransactions");

    res.status(200).json({
      success: true,
      message: "Business order updated successfully",
      data: populatedOrder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating business order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteBusinessOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid business order ID",
      });
    }

    const deletedBusinessOrder = await BusinessOrder.findByIdAndDelete(id);

    if (!deletedBusinessOrder) {
      return res.status(404).json({
        success: false,
        message: "Business order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Business order deleted successfully",
      data: deletedBusinessOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting business order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getBusinessOrdersBySupplier = async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier ID",
      });
    }

    const businessOrders = await BusinessOrder.find({ supplier: supplierId })
      .populate("supplier", "name")
      .populate("relatedTransactions")
      .limit(limit as number)
      .skip(((page as number) - 1) * (limit as number))
      .sort({ date: -1 });

    const total = await BusinessOrder.countDocuments({ supplier: supplierId });

    res.status(200).json({
      success: true,
      message: "Business orders retrieved successfully",
      data: businessOrders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / (limit as number)),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving business orders",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export {
  createBusinessOrder,
  deleteBusinessOrder,
  getAllBusinessOrders,
  getBusinessOrderById,
  getBusinessOrdersBySupplier,
  updateBusinessOrder,
};
