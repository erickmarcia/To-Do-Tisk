export const MESSAGES = {
  TASK: {
    CREATED: "Task created successfully",
    UPDATED: "Task updated successfully",
    DELETED: "Task deleted successfully",
    NOT_FOUND: "Task not found",
    LIST_RETRIEVED: "Tasks retrieved successfully",
  },
  USER: {
    CREATED: "User created successfully",
    FOUND: "User found",
    NOT_FOUND: "User not found",
    ALREADY_EXISTS: "User already exists",
  },
  AUTH: {
    TOKEN_REQUIRED: "Authorization token required",
    TOKEN_INVALID: "Invalid or expired token",
    UNAUTHORIZED: "Unauthorized",
  },
  VALIDATION: {
    FAILED: "Validation failed",
  },
  SERVER: {
    ERROR: "Internal server error",
    NOT_FOUND: "Route not found",
  },
} as const;
