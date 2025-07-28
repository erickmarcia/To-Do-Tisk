// functions/src/infrastructure/web/app.ts
import { initializeApp, getApps } from "firebase-admin/app";
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

// Inicializa Firebase Admin SDK de forma segura
if (getApps().length === 0) {
  initializeApp();
}

// Crea la aplicación Express
const app = express();

// Log para debugging
// console.log("Creating Express app...");
// console.log("Environment:", process.env.NODE_ENV);
// console.log("Functions Emulator:", process.env.FUNCTIONS_EMULATOR);
// console.log("Port:", process.env.PORT);

// Middlewares de seguridad
app.use(helmet());

// Configuración CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://todo-tisk.com"]
        : [
            "http://localhost:4200",
            "http://localhost:3000",
            "http://localhost:4000",
          ],
    credentials: true,
  })
);

// Middleware de logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Middleware de parseo de cuerpo (JSON)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de todas las requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Endpoint de salud de la api
app.get("/health", (req, res) => {
  console.log("Health check endpoint called");
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    port: process.env.PORT || "8080",
  });
});

app.get("/", (req, res) => {
  console.log("Root endpoint called");
  res.status(200).json({
    message: "To-Do Tisk API está funcionando!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api_docs: "/api",
      tasks: "/tasks",
      users: "/users",
      ping: "/ping",
    },
  });
});

// Configuración de inyección de dependencias
const setupDependencies = () => {
  try {
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
      createUserUseCase,
      findUserByEmailUseCase
    );

    return { taskController, userController };
  } catch (error) {
    throw error;
  }
};

// Configura las rutas
// console.log("Setting up routes...");
const { taskController, userController } = setupDependencies();

// Prefijo /api para todas las rutas de la API
// app.use("/api/tasks", createTaskRoutes(taskController));
// app.use("/api/users", createUserRoutes(userController));

app.use("/tasks", createTaskRoutes(taskController));
app.use("/users", createUserRoutes(userController));

// Endpoint de documentación de la API
app.get("/api", (req, res) => {
  res.json({
    name: "To-Do Tisk API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
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
      root: {
        "GET /": "API information",
      },
    },
  });
});

// // Ruta simple para test
// app.get("/ping", (req, res) => {
//   console.log("Ping endpoint called");
//   res.json({
//     message: "pong",
//     timestamp: new Date().toISOString(),
//     port: process.env.PORT || "8080",
//   });
// });

// Middleware para capturar todas las rutas no encontradas
app.use("*", (req, res, next) => {
  console.log(`Route not found: ${req.method} ${req.originalUrl}`);
  next();
});

// Middlewares de manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Solo para desarrollo local con emulador
if (!process.env.FUNCTIONS_EMULATOR) {
  const PORT = process.env.PORT || 3000;
  console.log(`Starting server on port ${PORT} for emulator...`);
  app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

export { app };
