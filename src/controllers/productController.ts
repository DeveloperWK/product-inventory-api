// import { Request, Response } from "express";
// import mongoose, { Types } from "mongoose";
// import Category from "../models/Categorys";
// import Product from "../models/Products";

// const createProduct = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const requireFields = ["name", "price", "category", "stock"];
//     const missingFields = requireFields.filter((field) => !req.body[field]);
//     if (missingFields.length > 0) {
//       res
//         .status(500)
//         .send(
//           `All fields are required: ${missingFields.join(", ")} are missing`,
//         );
//       return;
//     }
//     const { name, price, category, stock, description } = req.body;
//     const product = await new Product({
//       name,
//       price,
//       category,
//       stock,
//       description,
//     }).save();

//     res.status(201).json({
//       message: "Product created successfully",
//       product,
//     });
//   } catch (err) {
//     res.status(400).json({ error: (err as Error).message });
//   }
// };

// const getProducts = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { page, limit, min, max, category } = req.query;

//     const pageSize = Number(limit) || 5;
//     const currentPage = Number(page) || 1;
//     const skip = (currentPage - 1) * pageSize;

//     const filters: {
//       price?: { $gte: number; $lte: number };
//       category?: Types.ObjectId;

//       // stock?: { $gte: number };
//     } = {};

//     if (typeof min === "string" && typeof max === "string") {
//       filters.price = {
//         $gte: Number(min),
//         $lte: Number(max),
//       };
//     }

//     if (typeof category === "string") {
//       if (mongoose.Types.ObjectId.isValid(category)) {
//         filters.category = new mongoose.Types.ObjectId(category);
//       } else {
//         const categoryDoc = await Category.findOne({ name: category });
//         if (!categoryDoc) {
//           res.status(404).json({ message: "Category not found" });
//           return;
//         }
//         filters.category = categoryDoc._id as Types.ObjectId;
//       }
//     }

//     const productsWithTotalStock = await Product.aggregate([
//       {
//         $facet: {
//           productList: [
//             {
//               $match: filters,
//             },
//             {
//               $lookup: {
//                 from: "categories",
//                 localField: "category",
//                 foreignField: "_id",
//                 as: "categoryDetails",
//               },
//             },
//             {
//               $unwind: "$categoryDetails",
//             },
//             {
//               $addFields: {
//                 categoryName: "$categoryDetails.name",
//               },
//             },

//             {
//               $skip: skip,
//             },
//             {
//               $project: {
//                 _id: 1,
//                 name: 1,
//                 stock: 1,
//                 price: 1,
//                 categoryName: 1,
//               },
//             },
//             {
//               $limit: pageSize,
//             },
//           ],

//           categoryWiseStock: [
//             // {
//             //   $match: {
//             //     stock: { $gt: 0 }, // Apply the same filter
//             //   },
//             // },
//             {
//               $lookup: {
//                 from: "categories",
//                 localField: "category",
//                 foreignField: "_id",
//                 as: "categoryDetails",
//               },
//             },
//             {
//               $unwind: "$categoryDetails",
//             },
//             {
//               $group: {
//                 _id: "$categoryDetails.name", // Group by category name
//                 totalStock: { $sum: "$stock" }, // Calculate total stock for the category
//               },
//             },
//             {
//               $project: {
//                 _id: 0, // Remove the default _id field
//                 categoryName: "$_id", // Use category name as the key
//                 totalStock: 1,
//               },
//             },
//           ],

//           totalStock: [
//             // {
//             //   $match: {
//             //     stock: { $gt: 0 }, // Apply the same filter
//             //   },
//             // },
//             {
//               $group: {
//                 _id: null, // Group all products together
//                 fullStock: { $sum: "$stock" }, // Calculate total stock
//               },
//             },
//             {
//               $project: {
//                 _id: 0, // Remove the default _id field
//                 fullStock: 1, // Include only the total stock
//               },
//             },
//           ],
//           averagePrice: [
//             {
//               $group: {
//                 _id: null, // Group all products together
//                 averagePrice: { $avg: "$price" }, // Calculate average price
//               },
//             },
//             {
//               $project: {
//                 _id: 0, // Remove the default _id field
//                 averagePrice: { $round: ["$averagePrice", 2] }, // Include only the average price
//               },
//             },
//           ],
//         },
//       },
//     ]);
//     const count = await Product.countDocuments(filters);

//     res.status(200).json({
//       message: "Products retrieved successfully",
//       productsWithTotalStock,
//       currentPage,
//       count,
//       totalPages: Math.ceil(count / pageSize),
//     });
//   } catch (err) {
//     res.status(500).json({ error: (err as Error).message });
//   }
// };
// const getProduct = async (req: Request, res: Response): Promise<void> => {
//   const { id } = req.params;
//   try {
//     const product = await Product.findById(id)
//       .populate("category", "name -_id")
//       .exec();
//     if (!product) {
//       res.status(404).json({ message: "Product not found" });
//       return;
//     }
//     res
//       .status(200)
//       .json({ message: "Product retrieved successfully", product });

//     return;
//   } catch (err) {
//     res.status(500).json({ error: (err as Error).message });
//     return;
//   }
// };

// const deleteProduct = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     const product = await Product.findByIdAndDelete(id);
//     res.status(200).json({ message: "Product deleted successfully", product });
//     return;
//   } catch (err) {
//     res.status(500).json({ error: (err as Error).message });
//     return;
//   }
// };
// const updateProduct = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { name, price, stock, description } = req.body;
//   try {
//     const product = await Product.findByIdAndUpdate(
//       id,
//       {
//         name,
//         price,
//         stock,
//         description,
//       },
//       { new: true },
//     );
//     res.status(202).json({ message: "Product updated successfully", product });
//     return;
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//     return;
//   }
// };

// export { createProduct, deleteProduct, getProduct, getProducts, updateProduct };
import { Request, Response } from "express";
import Product, { IProduct } from "../models/Products";

// Create Product
export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, sku, price, cost, stock } = req.body;

    if (!name || !sku || !price || !cost || stock === undefined) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const newProduct: IProduct = new Product({
      name,
      sku,
      price,
      cost,
      stock,
      description: req.body.description,
      category: req.body.category,
      reorderLevel: req.body.reorderLevel,
      supplier: req.body.supplier,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: "SKU must be unique" });
      return;
    }
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

// Get All Products
export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { category, minPrice, maxPrice, lowStock } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (lowStock === "true") {
      filter.$expr = { $lt: ["$stock", "$reorderLevel"] };
    }

    const products = await Product.find(filter).populate(
      "supplier",
      "-_id name",
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: (error as Error).message,
    });
  }
};

// Get Single Product
export const getProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("supplier");

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: (error as Error).message,
    });
  }
};

// Update Product
export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const updates = req.body;
    const { id } = req.params;
    // Prevent SKU updates if provided
    if (updates.sku) {
      res.status(400).json({ message: "SKU cannot be modified" });
      return;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("supplier");

    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: (error as Error).message,
    });
  }
};

// Delete Product
export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: (error as Error).message,
    });
  }
};

// Update Product Quantity
export const updateStock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { action, stock } = req.body;
    const { id } = req.params;
    if (!["increment", "decrement", "set"].includes(action) || !stock) {
      res.status(400).json({ message: "Invalid action or stock" });
      return;
    }

    const product: IProduct | null = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    let updateQuery = {};
    switch (action) {
      case "increment":
        updateQuery = { $inc: { stock } };
        break;
      case "decrement":
        if (product.stock < stock) {
          res.status(400).json({ message: "Insufficient stock" });
          return;
        }
        updateQuery = { $inc: { stock: -stock } };
        break;
      case "set":
        updateQuery = { $set: { stock } };
        break;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Error updating stock",
      error: (error as Error).message,
    });
  }
};
