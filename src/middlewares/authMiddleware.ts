import { configDotenv } from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
configDotenv();
// Extend the Request interface to include a 'user' property
declare global {
  namespace Express {
    interface Request {
      locals?: any; // Replace 'any' with a proper type if you know the structure of the decoded token
    }
  }
}

const SECRET = process.env.AUTH_SECRET;

if (!SECRET) {
  throw new Error("AUTH_SECRET is not defined in the environment variables.");
}

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No Token Provided" });
      return;
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      req.locals = decoded;

      next();
    });
  } catch (error) {
    console.error("Unexpected error in authMiddleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default authMiddleware;
