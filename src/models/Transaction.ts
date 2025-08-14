import mongoose, { Document } from "mongoose";

export interface ITransaction extends Document {
  type: "income" | "expense" | "transfer";
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
  isRecurring: boolean;
  cashAccount: mongoose.Schema.Types.ObjectId;
  transactionId: string;
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
    isRecurring: { type: Boolean, default: false },
    cashAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CashAccount",
      required: true,
    },
    transactionId: String,
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
