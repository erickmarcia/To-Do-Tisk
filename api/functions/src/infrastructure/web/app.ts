// functions/src/infrastructure/web/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Importa rutas
import { createTaskRoutes } from "../../presentation/routes/taskRoutes";
import { createUserRoutes } from "../../presentation/routes/userRoutes";

// Importa controladores
import { TaskController } from "../../presentation/controllers/TaskController";
import { UserController } from "../../presentation/controllers/UserController";

// Importa casos de uso
import { CreateTaskUseCase } from "../../application/use-cases/task/CreateTaskUseCase";
import { GetTasksUseCase } from "../../application/use-cases/task/GetTasksUseCase";
import { UpdateTaskUseCase } from "../../application/use-cases/task/UpdateTaskUseCase";
import { DeleteTaskUseCase } from "../../application/use-cases/task/DeleteTaskUseCase";
import { FindUserByEmailUseCase } from "../../application/use-cases/users/FindUserByEmailUseCase";
import { CreateUserUseCase } from "../../application/use-cases/users/CreateUserUseCase";

// Importa repositorios
import { FirebaseTaskRepository } from "../repositories/FirebaseTaskRepository";
import { FirebaseUserRepository } from "../repositories/FirebaseUserRepository";

// Importa middlewares de error
import { errorHandler, notFoundHandler } from "../middleware/errorMiddleware";

// Importa utilidades
import { Logger } from "../../shared/utils/logger";

// Crea la aplicación Express
const app = express();

// Middlewares de seguridad
app.use(helmet());

// Configuración CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://todo-tisk.com"] 
        : ["http://localhost:4200", "http://localhost:3000"],
    credentials: true,
  })
);

// Middleware de logging
app.use(morgan("combined"));

// Middleware de parseo de cuerpo (JSON)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Endpoint de salud de la api
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Configuración de inyección de dependencias
const setupDependencies = () => {
  // Repositorios
  const taskRepository = new FirebaseTaskRepository();
  const userRepository = new FirebaseUserRepository();

  // Casos de uso
  const createTaskUseCase = new CreateTaskUseCase(taskRepository);
  const getTasksUseCase = new GetTasksUseCase(taskRepository);
  const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
  const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
  const findUserByEmailUseCase = new FindUserByEmailUseCase(userRepository);
  const createUserUseCase = new CreateUserUseCase(userRepository);

  // Controladores
  const taskController = new TaskController(
    createTaskUseCase,
    getTasksUseCase,
    updateTaskUseCase,
    deleteTaskUseCase
  );

  const userController = new UserController(
    findUserByEmailUseCase,
    createUserUseCase
  );

  return { taskController, userController };
};

// Configura las rutas
const { taskController, userController } = setupDependencies();

app.use("/tasks", createTaskRoutes(taskController));
app.use("/users", createUserRoutes(userController));

// Endpoint de documentación de la API
app.get("/api", (req, res) => {
  res.json({
    name: "ToDo API",
    version: "1.0.0",
    endpoints: {
      tasks: {
        "GET /api/tasks?userId=xxx": "Get all tasks for user",
        "POST /api/tasks": "Create new task",
        "PUT /api/tasks/:id": "Update task",
        "DELETE /api/tasks/:id": "Delete task",
      },
      users: {
        "GET /api/users/:email": "Find user by email",
        "POST /api/users": "Create new user",
      },
      health: {
        "GET /health": "Health check",
      },
    },
  });
});

// Ruta simple para test
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});


// Middlewares de manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
