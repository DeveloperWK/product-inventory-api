import { configDotenv } from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
configDotenv();
const SECRET = process.env.AUTH_SECRET as string;
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
const isAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No Token Provided" });
      return;
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as { id: string };
    req.userId = decoded.id as string;

    const userRole = await User.findById(req.userId).select("role -_id");

    if (!userRole || userRole.role !== "admin") {
      res.status(403).json({ message: "Unauthorized: User is not an admin" });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
};
export default isAdminMiddleware;
