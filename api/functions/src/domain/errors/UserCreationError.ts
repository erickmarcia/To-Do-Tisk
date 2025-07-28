import { DomainError } from "./DomainError";

export class UserCreationError extends DomainError {
  readonly errorType = "USER_CREATION_ERROR";

  constructor(message: string = "Failed to create user") {
    super(message);
  }
}
