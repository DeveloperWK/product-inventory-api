import { NextFunction, Request, Response } from "express";

const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Not Found ${req.originalUrl}`);
  res.status(404);
  next(error);
};
export default notFoundMiddleware;
