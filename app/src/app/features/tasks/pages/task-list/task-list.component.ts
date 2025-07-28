// src/app/features/tasks/pages/task-list/task-list.component.ts
import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";

import { TaskService } from "../../services/task.service";
import { AuthService } from "../../../../core/auth/auth.service";
import { Task } from "../../models/task";
import { TaskItemComponent } from "../../components/task-item/task-item.component";
import { TaskFormComponent } from "../../components/task-form/task-form.component";
import { ShortDatePipe } from "../../../../core/shared/pipes/short-date.pipe";
import Swal from "sweetalert2";

@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    TaskItemComponent,
    TaskFormComponent,
    ShortDatePipe,
  ],
  templateUrl: "./task-list.component.html",
  styleUrls: ["./task-list.component.scss"],
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  isLoading = false;
  searchTerm = "";
  showCompleted = true;
  showTaskForm: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.subscribeToTasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToTasks(): void {
    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tasks) => {
        this.tasks = tasks;
        this.filterTasks();
      });
  }

  private loadTasks(): void {
    this.isLoading = true;

    this.taskService
      .loadTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.showError("No se pudieron cargar las tareas");
        },
      });
  }

  onTaskCreated(task: Task): void {
    this.loadTasks();
    this.showTaskForm = false;
    this.showSuccess("Tarea creada exitosamente!");
  }

  onTaskUpdated(task: Task): void {

    this.showSuccess("Tarea actualizada exitosamente!");
  }

  onTaskDeleted(): void {
    this.showSuccess("Tarea eliminada exitosamente!");
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.filterTasks();
  }

  toggleShowCompleted(): void {
    this.showCompleted = !this.showCompleted;
    this.filterTasks();
  }

  toggleTaskFormVisibility() {
    this.showTaskForm = !this.showTaskForm;
  }

  private filterTasks(): void {
    this.filteredTasks = this.tasks.filter((task) => {
      const matchesSearch =
        !this.searchTerm ||
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCompletedFilter = this.showCompleted || !task.completed;

      return matchesSearch && matchesCompletedFilter;
    });

  }

  logout(): void {
    this.taskService.clearTasks(); 
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  get pendingTasksCount(): number {
    return this.tasks.filter((task) => task.status === "pending").length;
  }

  get completedTasksCount(): number {
    return this.tasks.filter((task) => task.status === "completed").length;
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  private showSuccess(message: string): void {
     Swal.fire({
       toast: true,
       icon: "success",
       title: message,
       timer: 3000,
       showConfirmButton: false,
       position: "top-end",
     });
  }

  private showError(message: string): void {
     Swal.fire({
       toast: true,
       icon: "error",
       title: message,
       timer: 5000,
       showConfirmButton: false,
       position: "top-end",
     });

  }
}
