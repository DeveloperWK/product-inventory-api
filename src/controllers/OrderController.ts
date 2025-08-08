// import { Request, Response } from "express";
// import Order from "../models/Orders";
// import Product from "../models/Products";

// const createOrder = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { orderId, productId, quantity, price, due } = req.body;
//     if (!orderId || !productId || !quantity || !price) {
//       res.status(500).send(`All fields are required`);
//       return;
//     }
//     const order = await new Order({
//       orderId,
//       price,
//       product: productId,
//       due,
//       quantity,
//     }).save();
//     if (order) {
//       const product = await Product.findById(productId);
//       if (product) {
//         product.stock -= quantity;
//         await product.save();
//       }
//     }
//     res.status(201).json({
//       message: "Order created successfully",
//       data: order,
//     });
//   } catch (err) {
//     res.status(400).json({ error: (err as Error).message });
//   }
// };

// const getOrders = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const orders = await Order.find();
//     const count = await Order.countDocuments();
//     res.status(200).json({
//       message: "Orders retrieved successfully",
//       data: orders,
//       count,
//     });
//   } catch (err) {
//     res.status(500).json({ error: (err as Error).message });
//   }
// };
// const getOrder = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const order = await Order.findById(id);
//     res.status(200).json(order);
//   } catch (err) {
//     res.status(500).json({ error: (err as Error).message });
//   }
// };

// const deleteOrder = async () => {};
// const updateOrder = async (req: Request, res: Response): Promise<void> => {
//   const { id } = req.params;
//   const { productId, quantity, price, due } = req.body;
//   const order = await Order.findByIdAndUpdate(id, {
//     price,
//     product: productId,
//     due,
//     quantity,
//   });
//   if (order) {
//     const product = await Product.findById(productId);
//     if (product) {
//       product.stock -= quantity;
//       await product.save();
//     }
//     res.status(200).json({
//       message: "Order updated successfully",
//       data: order,
//     });
//   } else {
//     res.status(404).json({ error: "Order not found" });
//   }
// };

// export { createOrder, deleteOrder, getOrder, getOrders, updateOrder };
import { Request, Response } from "express";
import mongoose from "mongoose";
import Order, { IOrder } from "../models/Orders";
import Product from "../models/Products";

// Create Order
const createOrder = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { orderType, items, totalAmount } = req.body;
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (orderType === "sale" && product!.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product?.name}`);
      }
    }

    const newOrder: IOrder = await new Order({
      orderType,
      items,
      totalAmount,
    }).save();
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }, // Decrease stock
        { session }, // Use same transaction session
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

// Get All Orders
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

// Get Single Order
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

// Update Order
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

// Delete Order
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
