import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  category: Schema.Types.ObjectId;
  stock: number;
  description?: string;
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
    stock: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
