import { body, param, query } from "express-validator";
import { TaskStatus } from "../../domain/enums/TaskStatus";

export const createTaskValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
];

export const updateTaskValidation = [
  param("id").notEmpty().withMessage("Task ID is required"),

  body("title")
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("status")
    .optional()
    .isIn([TaskStatus.PENDING, TaskStatus.COMPLETED])
    .withMessage("Status must be either pending or completed"),
];

export const deleteTaskValidation = [
  param("id").notEmpty().withMessage("Task ID is required"),
];

export const getTasksValidation = [
  query("userId").notEmpty().withMessage("User ID is required"),
];
