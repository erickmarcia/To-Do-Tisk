// functions/src/index.ts
import "dotenv/config";
import { app } from "./infrastructure/web/app";
import { https } from "firebase-functions/v2";

// Configurar variables de entorno para desarrollo local
if (process.env.NODE_ENV === "development" || process.env.FUNCTIONS_EMULATOR) {
  console.log("Loading environment variables for development/emulator");
  require("dotenv").config();
}

// console.log("Initializing Firebase Functions...");
// console.log("Environment:", process.env.NODE_ENV);
// console.log("Emulator mode:", process.env.FUNCTIONS_EMULATOR);

// Exportar la función principal de Firebase
export const apiTodoTisk = https.onRequest(
  {
    region: "us-central1",
    // Configuraciones adicionales para mejorar el rendimiento
    memory: "512MiB",
    timeoutSeconds: 300,
    maxInstances: 10,
    // Configuración de CORS para Firebase Functions v2
    cors: [
      "http://localhost:4200",
      "http://localhost:3000",
      "https://todo-tisk.com",
    ],
  },
  app
);

console.log("Firebase Functions configuration completed");
