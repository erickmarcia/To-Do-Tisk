import { Routes } from "@angular/router";
import { AuthGuard } from "./core/auth/auth.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () =>
      import("./features/auth/pages/login/login.component").then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: "tasks",
    loadComponent: () =>
      import("./features/tasks/pages/task-list/task-list.component").then(
        (m) => m.TaskListComponent
      ),
    canActivate: [AuthGuard], 
  },
  {
    path: "**",
    redirectTo: "/login", 
  },
];
