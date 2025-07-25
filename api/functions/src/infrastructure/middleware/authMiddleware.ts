import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase";
import { ResponseHandler } from "../../shared/utils/response";
import { Logger } from "../../shared/utils/logger";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ResponseHandler.unauthorized(res, "Authorization token required");
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    next();
  } catch (error) {
    Logger.error("Authentication failed:", error);
    ResponseHandler.unauthorized(res, "Invalid or expired token");
  }
};
