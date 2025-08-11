import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Orders";
import Product from "../models/Products";

const calculateTotal = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [productStats, orderStats] = await Promise.all([
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            totalStock: { $sum: "$stock" },
          },
        },
      ]),

      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            processing: {
              $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] },
            },
            delivered: {
              $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
            },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            returned: {
              $sum: { $cond: [{ $eq: ["$status", "returned"] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const result = {
      products: {
        total: productStats[0]?.totalProducts || 0,
        totalStock: productStats[0]?.totalStock || 0,
      },
      orders: {
        total: orderStats[0]?.totalOrders || 0,
        status: {
          processing: orderStats[0]?.processing || 0,
          delivered: orderStats[0]?.delivered || 0,
          cancelled: orderStats[0]?.cancelled || 0,
          completed: orderStats[0]?.completed || 0,
          returned: orderStats[0]?.returned || 0,
        },
      },
    };
    session.commitTransaction();
    res.status(200).json(result);
  } catch (err) {
    session.abortTransaction();
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    session.endSession();
  }
};
export default calculateTotal;
