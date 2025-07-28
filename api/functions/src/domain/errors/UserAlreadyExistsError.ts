import { DomainError } from "./DomainError";

export class UserAlreadyExistsError extends DomainError {
  readonly errorType = "USER_ALREADY_EXISTS";

  constructor(message: string = "User already exists") {
    super(message);
  }
}
