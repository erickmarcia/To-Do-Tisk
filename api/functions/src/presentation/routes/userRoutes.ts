// functions/src/presentation/routes/userRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/UserController";

export const createUserRoutes = (userController: UserController): Router => {
  const router = Router();

  console.log("Setting up user routes...");

  // GET /api/users/:email - Find user by email
  router.get("/:email", (req, res) => {
    console.log("Route: GET /api/users/:email called");
    userController.getUserByEmail(req, res);
  });

  // POST /api/users - Create new user
  router.post("/", (req, res) => {
    console.log("Route: POST /api/users called");
    userController.createUser(req, res);
  });

  console.log("User routes configured successfully");
  return router;
};
