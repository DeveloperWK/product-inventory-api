import mongoose, { Document } from "mongoose";

export interface ITransaction extends Document {
  type: "income" | "expense" | "transfer";
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
  relatedInventory: mongoose.Schema.Types.ObjectId;
  relatedOrder: mongoose.Schema.Types.ObjectId;
  isRecurring: boolean;
  cashAccount: mongoose.Schema.Types.ObjectId;
}

const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: ["income", "expense", "transfer"],
      required: true,
    },
    category: String, // e.g., "inventory_purchase", "sales_revenue"
    amount: { type: Number, required: true },
    date: { type: String, default: new Date().toISOString() },
    description: String,
    paymentMethod: String,
    relatedInventory: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Links to inventory
    relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // Optional
    isRecurring: { type: Boolean, default: false },
    cashAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CashAccount",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema,
);
export default Transaction;
