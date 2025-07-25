import { IUserRepository } from "../../interfaces/IUserRepository";
import { User } from "../../../domain/entities/User";
import { Email } from "../../../domain/value-objects/Email";

export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string): Promise<User | null> {
    const emailVO = new Email(email);
    return await this.userRepository.findByEmail(emailVO);
  }
}
