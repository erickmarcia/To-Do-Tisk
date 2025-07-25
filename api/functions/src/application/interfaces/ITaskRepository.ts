import { Task } from "../../domain/entities/Task";
import { TaskId } from "../../domain/value-objects/TaskId";
import { UserId } from "../../domain/value-objects/UserId";

export interface ITaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: TaskId): Promise<Task | null>;
  findByUserId(userId: UserId): Promise<Task[]>;
  update(id: TaskId, updates: Partial<Task>): Promise<Task | null>;
  delete(id: TaskId): Promise<void>;
}
