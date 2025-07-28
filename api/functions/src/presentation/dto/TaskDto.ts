// src/dtos/TaskDto.ts

import { TaskStatus } from "domain/enums/TaskStatus";

export interface TaskDto {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category?: string;
  priority?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
}
