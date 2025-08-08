import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  orderType: string;
  price: number;
  items: [
    {
      product: Schema.Types.ObjectId;
      quantity: Number;
      unitPrice: Number;
    },
  ];
  totalAmount: Number;
  due: number;
  paymentStatus: "pending" | "paid" | "partial";
  status: "processing" | "delivered" | "cancelled" | "completed" | "returned";
  transaction: { type: mongoose.Schema.Types.ObjectId; ref: "Transaction" };
  courierId: { type: String; unique: true };
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    orderType: { type: String, enum: ["purchase", "sale"], required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        unitPrice: Number,
      },
    ],
    totalAmount: Number,
    status: {
      type: String,
      enum: ["processing", "delivered", "cancelled", "completed", "returned"],
      default: "processing",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "partial"],
      default: "pending",
    },
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    courierId: { type: String, unique: true },
  },
  {
    timestamps: true,
  },
);

// orderSchema.index({
//   title:"text",
//   body:"text",
//   }, { background: true })
orderSchema.index(
  {
    title: "text",
    body: "text",
  },
  {
    weights: {
      body: 5,
    },
    name: "courierId",
  },
);
const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
