// application/use-cases/user/CreateUserUseCase.ts
import { ValidationError } from "domain/errors/ValidationError";
import { User } from "../../../domain/entities/User";
import { Email } from "../../../domain/value-objects/Email";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { UserAlreadyExistsError } from "domain/errors/UserAlreadyExistsError";
import { UserCreationError } from "domain/errors/UserCreationError";

export interface CreateUserRequest {
  email: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: CreateUserRequest): Promise<User> {
    try {
      this.validateRequest(request);

      const { email } = request;

      const emailVO = new Email(email);

      // Verificar si el usuario ya existe
      const existingUser = await this.userRepository.findByEmail(emailVO);
      if (existingUser) {
        throw new UserAlreadyExistsError(
          `User with email ${email} already exists`
        );
      }

      // Crear el usuario del dominio
      const user = User.create(email);

      const savedUser = await this.userRepository.save(user);

      return savedUser;
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof UserAlreadyExistsError
      ) {
        throw error;
      }

      throw new UserCreationError(
        `Failed to create user: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private validateRequest(request: CreateUserRequest): void {
    if (!request.email || request.email.trim().length === 0) {
      throw new ValidationError("Email is required");
    }

    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      throw new ValidationError("Invalid email format"); // <--- OR HERE
    }
  }
}
