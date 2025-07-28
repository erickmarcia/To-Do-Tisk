import { DomainError } from "./DomainError";

export class UserNotFoundError extends DomainError {
  readonly errorType = "USER_NOT_FOUND";

  constructor(message: string = "User not found") {
    super(message);
  }
}
