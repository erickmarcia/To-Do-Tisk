import { DomainError } from "./DomainError";

export class EmailInvalidError extends DomainError {
  readonly errorType = "EMAIL_INVALID";

  constructor(message: string = "Invalid email format") {
    super(message);
  }
}
