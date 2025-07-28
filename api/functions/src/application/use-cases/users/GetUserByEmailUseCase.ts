import { IUserRepository } from "application/interfaces/IUserRepository";
import { User } from "domain/entities/User";
import { Email } from "domain/value-objects/Email";

export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findByEmail(new Email(email));

      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
