import { TaskStatus } from "../../domain/enums/TaskStatus";

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
