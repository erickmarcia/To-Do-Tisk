import { UniqueEntityID } from "shared/domain/UniqueEntityID";
import { User } from "../../domain/entities/User";
import { Email } from "../../domain/value-objects/Email";

export interface IUserRepository {
  findById(id: UniqueEntityID): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<User>;
  // update(user: User): Promise<void>;
  delete(id: UniqueEntityID): Promise<void>;
}
