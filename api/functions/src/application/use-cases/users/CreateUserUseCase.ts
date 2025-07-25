import { IUserRepository } from "../../interfaces/IUserRepository";
import { User } from "../../../domain/entities/User";
import { Email } from "domain/value-objects/Email";

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      new Email(email)
    );
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = User.create(email);
    await this.userRepository.save(user);
    return user;
  }
}
