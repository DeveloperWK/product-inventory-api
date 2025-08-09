import mongoose, { Document } from "mongoose";

export interface ISupplier extends Document {
  name: string;
  contact: string;
  paymentTerms: number;
  address?: string;
  notes?: string;
  isActive?: boolean;
}

const supplierSchema = new mongoose.Schema<ISupplier>({
  name: { type: String, required: true, trim: true },
  contact: String,
  paymentTerms: Number,
  address: String,
  notes: String,
  isActive: { type: Boolean, default: true },
});

const Supplier = mongoose.model<ISupplier>("Supplier", supplierSchema);
export default Supplier;
