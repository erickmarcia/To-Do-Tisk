import { Request, Response } from "express";
import { FindUserByEmailUseCase } from "../../application/use-cases/users/FindUserByEmailUseCase";
import { CreateUserUseCase } from "../../application/use-cases/users/CreateUserUseCase";
import { ResponseHandler } from "../../shared/utils/response";
import { Logger } from "../../shared/utils/logger";
import { CreateUserDto } from "../dto/CreateUserDto";

export class UserController {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      const user = await this.findUserByEmailUseCase.execute(email);

      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      ResponseHandler.success(res, user.toPlainObject(), "User found");
    } catch (error) {
      Logger.error("Error finding user by email:", error);

      if (error instanceof Error) {
        ResponseHandler.error(res, error.message, 400);
      } else {
        ResponseHandler.serverError(res, "Failed to find user");
      }
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email }: CreateUserDto = req.body;

      const user = await this.createUserUseCase.execute(email);

      ResponseHandler.created(
        res,
        user.toPlainObject(),
        "User created successfully"
      );
    } catch (error) {
      Logger.error("Error creating user:", error);

      if (error instanceof Error) {
        if (error.message === "User already exists") {
          ResponseHandler.error(res, error.message, 409);
        } else {
          ResponseHandler.error(res, error.message, 400);
        }
      } else {
        ResponseHandler.serverError(res, "Failed to create user");
      }
    }
  }
}
