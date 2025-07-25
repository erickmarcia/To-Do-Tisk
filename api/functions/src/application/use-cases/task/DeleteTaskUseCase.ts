import { ITaskRepository } from "../../interfaces/ITaskRepository";
import { TaskId } from "../../../domain/value-objects/TaskId";

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    const taskId = new TaskId(id);

    // Verificar que la tarea existe antes de eliminar
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    await this.taskRepository.delete(taskId);
  }
}
