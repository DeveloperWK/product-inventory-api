import { Request, Response } from "express";
import mongoose from "mongoose";
import Order, { IOrder } from "../models/Orders";
import Product from "../models/Products";
import handleCourier from "../utils/courierFunc";

const createOrder = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      orderType,
      items,
      totalAmount,
      courierId,
      invoice,
      recipient_name,
      recipient_phone,
      recipient_address,
      note,
    } = req.body;
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (orderType === "sale" && product!.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product?.name}`);
      }
    }
    const data = {
      recipient_name,
      recipient_phone,
      recipient_address,
      note,
      cod_amount: totalAmount,
      invoice,
    };
    const courier = await handleCourier(data);
    const newOrder: IOrder = await new Order({
      orderType,
      items,
      totalAmount,
      courierId: courier.consignment.consignment_id,
      trackingCode: courier.consignment.tracking_code,
    }).save();
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { session },
      );
    }
    await session.commitTransaction();
    res.status(201).json(newOrder);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      message: "Error creating order",
      error: (error as Error).message,
    });
  } finally {
    session.endSession();
  }
};

const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderType, status } = req.query;
    const filter: any = {};

    if (orderType) filter.orderType = orderType;
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate("items.product")
      .populate("transaction");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
      error: (error as Error).message,
    });
  }
};

const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("items.product")
      .populate("transaction");

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching order",
      error: (error as Error).message,
    });
  }
};

const updateOrder = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const updates: Partial<IOrder> = {};

    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("items.product");

    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    if (status === "returned") {
      for (const item of updatedOrder.items) {
        const product = await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } },
          { session },
        );

        if (!product) {
          throw new Error(`Product ${item.product} not found`);
        }
      }
    }
    await session.commitTransaction();
    res.json(updatedOrder);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      message: "Error updating order",
      error: (error as Error).message,
    });
  } finally {
    await session.endSession();
  }
};

const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting order",
      error: (error as Error).message,
    });
  }
};
export { createOrder, deleteOrder, getOrder, getOrders, updateOrder };
