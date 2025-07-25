// application/use-cases/task/CreateTaskUseCase.ts
import { Task } from "../../../domain/entities/Task";
import { ITaskRepository } from "../../interfaces/ITaskRepository";

export interface CreateTaskRequest {
  userId: string;
  title: string;
  description?: string;
}

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(request: CreateTaskRequest): Promise<Task> {
    const { userId, title, description = "" } = request;

    // Validar entrada
    if (!userId || userId.trim().length === 0) {
      throw new Error("User ID is required");
    }

    if (!title || title.trim().length === 0) {
      throw new Error("Task title is required");
    }

    try {
      // Crear nueva tarea usando el método estático
      const newTask = Task.createNew(userId, title, description);

      // Guardar en el repositorio - ahora retorna la tarea con ID
      const savedTask = await this.taskRepository.save(newTask);

      return savedTask;
    } catch (error) {
      console.error("Error in CreateTaskUseCase:", error);
      throw new Error(
        `Failed to create task: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
