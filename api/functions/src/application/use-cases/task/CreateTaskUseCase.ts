import { ValidationError } from "domain/errors/ValidationError";
import { Task } from "../../../domain/entities/Task";
import { ITaskRepository } from "../../interfaces/ITaskRepository";
import { TaskCreationError } from "domain/errors/TaskCreationError";

export interface CreateTaskRequest {
  userId: string;
  title: string;
  description?: string;
  category: string;
  priority: string;
}
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(request: CreateTaskRequest): Promise<Task> {
    try {
      // Validaciones básicas de entrada
      this.validateRequest(request);

      const { userId, title, description = "", category, priority } = request;

      // Crear nueva tarea usando el método estático del dominio
      const newTask = Task.createNew(
        userId,
        title,
        description,
        category,
        priority
      );

      // Guardar en el repositorio
      const savedTask = await this.taskRepository.save(newTask);

      return savedTask;
    } catch (error) {
      // Re-lanzar errores de dominio tal como están
      if (error instanceof ValidationError) {
        throw error;
      }

      // Wrappear errores técnicos en errores de dominio
      throw new TaskCreationError(
        `Failed to create task: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private validateRequest(request: CreateTaskRequest): void {
    if (!request.userId || request.userId.trim().length === 0) {
      throw new ValidationError("User ID is required");
    }

    if (!request.title || request.title.trim().length === 0) {
      throw new ValidationError("Task title is required");
    }
  }
}
