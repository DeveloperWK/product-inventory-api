import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    // process.exit(1);
    throw new Error("MongoDB connection error");
  }
};

export default connectDB;
