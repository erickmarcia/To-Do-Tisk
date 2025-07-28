import { Request, Response } from "express";
import { FindUserByEmailUseCase } from "../../application/use-cases/users/FindUserByEmailUseCase";
import { CreateUserUseCase } from "../../application/use-cases/users/CreateUserUseCase";
import { ResponseHandler } from "../../shared/utils/response";
import { Logger } from "../../shared/utils/logger";

// import { UpdateUserUseCase } from "../application/usecases/UpdateUserUseCase";
// import { DeleteUserUseCase } from "../application/usecases/DeleteUserUseCase";

import { GetUserUseCase } from "application/use-cases/users/GetUserUseCase";
import { UserDto } from "presentation/dto/UserDto";
import { ValidationError } from "domain/errors/ValidationError";
import { UserAlreadyExistsError } from "domain/errors/UserAlreadyExistsError";
import { UserCreationError } from "domain/errors/UserCreationError";
import { Email } from "domain/value-objects/Email";
import { UserNotFoundError } from "domain/errors/UserNotFoundError";

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.createUserUseCase.execute(req.body);
      const userDto: UserDto = user.toDTO();
      res.status(201).json({
        success: true,
        data: userDto,
        message: "User created successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
        details: error.stack,
      });

      this.handleError(error, res);
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email: emailString } = req.params;

      if (!emailString) {
        res.status(400).json({
          success: false,
          error: "Email parameter is required",
          details: "Email must be provided in the URL path",
        });
        return;
      }

      let email: Email;
      try {
        email = new Email(emailString);
      } catch (emailError: any) {
        res.status(400).json({
          success: false,
          error: "Invalid email format",
          details: emailError.message,
        });
        return;
      }

      const user = await this.findUserByEmailUseCase.execute(email);
      const userDto: UserDto = user.toDTO();

      res.status(200).json({
        success: true,
        data: userDto,
        message: "User found successfully",
      });
    } catch (error: any) {
      this.handleError(error, res);
    }
  }

  private handleError(error: any, res: Response): void {
    // Errores de dominio específicos
    if (error instanceof ValidationError) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.message,
      });
      return;
    }

    if (error instanceof UserNotFoundError) {
      res.status(404).json({
        success: false,
        error: "User not found",
        details: error.message,
      });
      return;
    }

    if (error instanceof UserAlreadyExistsError) {
      res.status(409).json({
        success: false,
        error: "User already exists",
        details: error.message,
      });
      return;
    }

    if (error instanceof UserCreationError) {
      res.status(500).json({
        success: false,
        error: "Failed to create user",
        details: error.message,
      });
      return;
    }

    // Errores específicos de Firebase/Database
    if (
      error.code?.startsWith("firestore/") ||
      error.code?.startsWith("firebase/")
    ) {
      res.status(500).json({
        success: false,
        error: "Database error",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Database operation failed",
      });
      return;
    }

    // Error genérico
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development"
          ? {
              message: error.message,
              stack: error.stack,
              type: error.constructor.name,
            }
          : undefined,
    });
  }
}
