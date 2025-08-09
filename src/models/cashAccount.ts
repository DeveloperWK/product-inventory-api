import mongoose, { Document } from "mongoose";

export interface ICashAccount extends Document {
  name: string;
  type: "bank" | "cash" | "mobile";
  balance: number;
  currency?: string;
  accountNumber?: string;
  institution?: string;
  isActive?: boolean;
}

const cashAccountSchema = new mongoose.Schema<ICashAccount>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["bank", "cash", "mobile"],
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "Tk",
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    institution: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const CashAccount = mongoose.model<ICashAccount>(
  "CashAccount",
  cashAccountSchema,
);
export default CashAccount;
