// src/app/features/tasks/models/task.ts

export enum TaskPriority {
  LOW = "Baja",
  MEDIUM = "Media",
  HIGH = "Alta",
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  completed: boolean;
  priority: TaskPriority;
  category?: string;
  userId: string; 
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateData {
  title: string;
  description: string;
  priority: TaskPriority;
  category?: string;
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  category?: string;
  completed?: boolean;
}
