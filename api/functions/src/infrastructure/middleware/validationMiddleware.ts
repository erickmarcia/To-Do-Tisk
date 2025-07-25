// // functions/src/infrastructure/middleware/validationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { ResponseHandler } from "../../shared/utils/response";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ");
    ResponseHandler.error(res, `Validation failed: ${errorMessages}`, 400);
    return;
  }

  next();
};

export const validate = (validations: ValidationChain[]) => {
  return [...validations, handleValidationErrors];
};
