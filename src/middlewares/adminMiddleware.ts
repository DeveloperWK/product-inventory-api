import { configDotenv } from "dotenv";
import { NextFunction, Request, Response } from "express";
configDotenv();
const SECRET = process.env.AUTH_SECRET as string;

const isAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.locals.role || req.locals.role !== "admin") {
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
