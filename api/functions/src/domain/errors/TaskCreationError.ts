import { DomainError } from "./DomainError";

export class TaskCreationError extends DomainError {
  readonly errorType = "TASK_CREATION_ERROR";

  constructor(message: string = "Failed to create task") {
    super(message);
  }
}
