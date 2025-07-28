import { DomainError } from "./DomainError";

export class ValidationError extends DomainError {
  readonly errorType = "VALIDATION_ERROR";

  constructor(message: string) {
    super(message);
  }
}
