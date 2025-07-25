// Archivo temporal para test: functions/src/test-app.ts
import express from "express";

const app = express();
app.use(express.json());

// Test endpoint simple
app.get("/", (req, res) => {
  res.json({
    message: "API funcionando!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint para tasks
app.post("/api/tasks", (req, res) => {
  console.log("POST /api/tasks received:", req.body);
  res.status(201).json({
    message: "Task endpoint working",
    received: req.body,
    timestamp: new Date().toISOString(),
  });
});

export { app };
