import { UserId } from "../../../domain/value-objects/UserId";
import { User } from "domain/entities/User";
import { IUserRepository } from "application/interfaces/IUserRepository";

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User[]> {
    const userIdObj = new UserId(userId);
    return await this.userRepository.findById(userIdObj);
  }
}
