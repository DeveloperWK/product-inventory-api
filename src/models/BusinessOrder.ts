import mongoose, { Document } from "mongoose";

export interface IBusinessOrder extends Document {
  name: string;
  supplier: mongoose.Schema.Types.ObjectId;
  date: string;
  due: number;
  payment: number;
  total: number;
  discount: number;
  relatedTransactions: mongoose.Schema.Types.ObjectId[];
  quantity: number;
}

const businessOrderSchema = new mongoose.Schema<IBusinessOrder>({
  name: { type: String, required: true, trim: true },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  date: { type: String, default: new Date().toISOString() },
  due: { type: Number, default: 0 },
  payment: { type: Number, required: true },
  total: { type: Number, required: true },
  discount: { type: Number, required: true },
  relatedTransactions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
  ],
  quantity: { type: Number, required: true },
});

const BusinessOrder = mongoose.model<IBusinessOrder>(
  "BusinessOrder",
  businessOrderSchema,
);
export default BusinessOrder;
