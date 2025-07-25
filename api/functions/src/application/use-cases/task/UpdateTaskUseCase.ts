import { ITaskRepository } from "../../interfaces/ITaskRepository";
import { Task } from "../../../domain/entities/Task";
import { TaskId } from "../../../domain/value-objects/TaskId";
import { TaskStatus } from "domain/enums/TaskStatus";
import { UpdateTaskDto } from "presentation/dto/UpdateTaskDto";

interface UpdateTaskRequest {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, dto: UpdateTaskDto): Promise<Task> {
    const taskId = new TaskId(id);

    const existingTask = await this.taskRepository.findById(taskId);
    if (!existingTask) {
      throw new Error("Task not found");
    }

    // Actualizar los campos usando los métodos de la entidad
    if (dto.title !== undefined) existingTask.updateTitle(dto.title);
    if (dto.description !== undefined)
      existingTask.updateDescription(dto.description);
    if (dto.status !== undefined) {
      if (dto.status === TaskStatus.COMPLETED) {
        existingTask.markAsCompleted();
      } else {
        existingTask.markAsPending();
      }
    }

    // Guardar cambios en Firestore
    const updatedTask = await this.taskRepository.update(taskId, existingTask);

    return updatedTask!;
  }
}
