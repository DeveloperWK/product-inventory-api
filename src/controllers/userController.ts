import { configDotenv } from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/Users";
import { hashPassword, verifyPassword } from "../services/password.service";
configDotenv();
const SECRET = process.env.AUTH_SECRET as string;

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const requireFields = ["username", "email", "password"];
    const missingFields = requireFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      res
        .status(500)
        .send(
          `All fields are required: ${missingFields.join(", ")} are missing`
        );
      return;
    }
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(500).send(`All fields are required`);
      return;
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(500).send("User already exists");
      return;
    }
    const user = await new User({
      username,
      email,
      password: await hashPassword(password),
    }).save();

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    const count = await User.countDocuments();
    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
      count,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(500).json({ message: "All fields are required" });
    return;
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(500).json({ message: "User not found" });
    return;
  }
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid username or password" });
    return;
  }
  const payload = {
    id: user!._id,
    email: user!.email,
    username: user!.username,
    role: user!.role,
  };
  const token = jwt.sign(payload, SECRET);
  res
    .status(200)
    .json({ message: "Logged in successfully", token, role: user?.role });
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully", user });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};
const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { username, password: await hashPassword(password) },
      { new: true }
    );
    res.status(202).json({ message: "User updated successfully", user });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

export { createUser, deleteUser, getUser, getUsers, loginUser, updateUser };
