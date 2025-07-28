import { IUserRepository } from "application/interfaces/IUserRepository";
import { User } from "../../../domain/entities/User";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { ValidationError } from "../../../domain/errors/ValidationError";
import { Email } from "../../../domain/value-objects/Email";

export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {
    console.log("🏗️ FindUserByEmailUseCase instantiated");
  }

  async execute(email: Email): Promise<User> {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw new UserNotFoundError(email.value);
      }

      return user;
    } catch (error: any) {
      // Si es un error de dominio conocido, lo re-lanzamos
      if (
        error instanceof UserNotFoundError ||
        error instanceof ValidationError
      ) {
        throw error;
      }

      // Para otros errores, lanzamos un error genérico con más información
      throw new Error(
        `Failed to find user by email: ${error?.message || error}`
      );
    }
  }
}
