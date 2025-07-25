// functions/src/presentation/routes/taskRoutes.ts
import { Router } from "express";
import { TaskController } from "../controllers/TaskController";

export const createTaskRoutes = (taskController: TaskController): Router => {
  const router = Router();

  console.log("Setting up task routes...");

  // GET /api/tasks?userId=xxx - Get all tasks for user
  router.get("/", (req, res) => {
    console.log("Route: GET /api/tasks called");
    taskController.getTasks(req, res);
  });

  // POST /api/tasks - Create new task
  router.post("/", (req, res) => {
    console.log("Route: POST /api/tasks called");
    taskController.createTask(req, res);
  });

  // PUT /api/tasks/:id - Update task
  router.put("/:id", (req, res) => {
    console.log("Route: PUT /api/tasks/:id called");
    taskController.updateTask(req, res);
  });

  // DELETE /api/tasks/:id - Delete task
  router.delete("/:id", (req, res) => {
    console.log("Route: DELETE /api/tasks/:id called");
    taskController.deleteTask(req, res);
  });

  console.log("Task routes configured successfully");
  return router;
};
