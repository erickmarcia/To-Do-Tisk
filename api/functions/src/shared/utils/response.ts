import { Response } from "express";
import { ApiResponse } from "../types/common";

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, error: string, statusCode = 400): Response {
    const response: ApiResponse = {
      success: false,
      error,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message = "Task created successfully"
  ): Response {
    return this.success(res, data, message, 201);
  }

  static notFound(res: Response, message = "Task not found"): Response {
    return this.error(res, message, 404);
  }

  static unauthorized(res: Response, message = "Unauthorized"): Response {
    return this.error(res, message, 401);
  }

  static serverError(
    res: Response,
    message = "Internal server error"
  ): Response {
    return this.error(res, message, 500);
  }
}
