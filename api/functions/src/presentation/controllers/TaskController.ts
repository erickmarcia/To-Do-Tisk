import { Request, Response } from "express";
import { ResponseHandler } from "../../shared/utils/response";
import { Logger } from "../../shared/utils/logger";
import { CreateTaskUseCase } from "../../application/use-cases/task/CreateTaskUseCase";
import { GetTasksUseCase } from "../../application/use-cases/task/GetTasksUseCase";
import { UpdateTaskUseCase } from "../../application/use-cases/task/UpdateTaskUseCase";
import { DeleteTaskUseCase } from "../../application/use-cases/task/DeleteTaskUseCase";
import { AuthenticatedRequest } from "../../infrastructure/middleware/authMiddleware";
import { CreateTaskDto } from "../dto/CreateTaskDto";
import { UpdateTaskDto } from "../dto/UpdateTaskDto";
import { TaskDto } from "presentation/dto/TaskDto";
import { tasks } from "firebase-functions/v2";

export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase
  ) {}

  async getTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = (req.query.userId as string) || req.user?.uid;

      if (!userId) {
        ResponseHandler.error(res, "User ID is required");
        return;
      }

      const tasks = await this.getTasksUseCase.execute(userId);
      const tasksDto: TaskDto[] = tasks.map((task) => task.toDTO());

      ResponseHandler.success(res, tasksDto, "Tasks retrieved successfully");
    } catch (error) {
      Logger.error("Error getting tasks:", error);
      ResponseHandler.serverError(res, "Failed to retrieve tasks");
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.createTaskUseCase.execute(req.body);
      // res.status(200).json(task.toDTO());
      // res.status(201).json(task.toDTO());
      const taskDto: TaskDto = task.toDTO();
      // res.status(200).json(taskDto);
      ResponseHandler.success(res, task.toDTO(), "Tarea creada exitosamente");
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
        details: error.stack,
      });
    }
  }

  async updateTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateTaskDto = req.body;

      const updatedTask = await this.updateTaskUseCase.execute(id, updateData);

      ResponseHandler.success(
        res,
        updatedTask.toDTO(),
        "Task updated successfully"
      );
    } catch (error) {
      Logger.error("Error updating task:", error);

      if (error instanceof Error) {
        if (error.message === "Task not found") {
          ResponseHandler.notFound(res, error.message);
        } else {
          ResponseHandler.error(res, error.message, 400);
        }
      } else {
        ResponseHandler.serverError(res, "Failed to update task");
      }
    }
  }

  async deleteTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await this.deleteTaskUseCase.execute(id);

      ResponseHandler.success(res, null, "Task deleted successfully");
    } catch (error) {
      Logger.error("Error deleting task:", error);

      if (error instanceof Error) {
        if (error.message === "Task not found") {
          ResponseHandler.notFound(res, error.message);
        } else {
          ResponseHandler.error(res, error.message, 400);
        }
      } else {
        ResponseHandler.serverError(res, "Failed to delete task");
      }
    }
  }
}
