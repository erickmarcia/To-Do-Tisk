import { ITaskRepository } from "../../interfaces/ITaskRepository";
import { Task } from "../../../domain/entities/Task";
import { UserId } from "../../../domain/value-objects/UserId";

export class GetTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(userId: string): Promise<Task[]> {
    const userIdObj = new UserId(userId);
    return await this.taskRepository.findByUserId(userIdObj);
  }
}
