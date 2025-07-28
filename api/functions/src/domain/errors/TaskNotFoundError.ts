import { DomainError } from "./DomainError";

export class TaskNotFoundError extends DomainError {
  readonly errorType = "TASK_NOT_FOUND";

  constructor(message: string = "Task not found") {
    super(message);
  }
}
