import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  sku: string;
  cost: number;
  category: Schema.Types.ObjectId;
  supplier: Schema.Types.ObjectId;
  stock: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stock: { type: Number, default: 0 },
    sku: { type: String, unique: true },
    cost: { type: Number, required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  },
  { timestamps: true },
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
