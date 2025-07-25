import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../../shared/utils/response";
import { Logger } from "../../shared/utils/logger";

export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  Logger.error("Unhandled error:", error);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  ResponseHandler.error(res, message, statusCode);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ResponseHandler.notFound(res, `Route ${req.originalUrl} not found`);
};
