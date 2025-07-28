import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxChange, MatCheckboxModule } from "@angular/material/checkbox";
import { MatMenuModule } from "@angular/material/menu";
// import { MatChipModule } from "@angular/material/chip";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";

import { Task, TaskPriority } from "../../models/task";
import { TaskService } from "../../services/task.service";
import { ConfirmDialogComponent } from "../../../../core/shared/components/confirm-dialog/confirm-dialog.component";
import { TaskFormComponent } from "../task-form/task-form.component";
import { ShortDatePipe } from "../../../../core/shared/pipes/short-date.pipe";
import Swal from "sweetalert2";

@Component({
  selector: "app-task-item",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatMenuModule,
    // MatChipModule,
    MatDialogModule,
    ShortDatePipe,
  ],
  templateUrl: "./task-item.component.html",
  styleUrls: ["./task-item.component.scss"],
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<void>();

  isUpdating = false;

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  onToggleComplete(event: MatCheckboxChange): void {
    this.isUpdating = true;
    const updatedTask = {
      ...this.task,
      completed: event.checked,
      status: event.checked ? "completed" : "pending",
    };

    // Llama al servicio aquí si deseas que sea autónomo.
    this.taskService.updateTask(updatedTask.id, updatedTask).subscribe({
      next: (updated) => {
        this.isUpdating = false;
        this.taskUpdated.emit(updated);
      },
      error: (err) => {
        console.error("Error actualizando tarea", err);
        this.isUpdating = false;
      },
    });
  }

  onEdit(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: { task: this.task },
      width: "500px",
      maxWidth: "90vw",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskUpdated.emit(result);
      }
    });
  }

  onDelete(): void {
    Swal.fire({
      title: "¿Seguro que desea eliminar esta tarea?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6600",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteTask();
      }
      return result.isConfirmed;
    });
  }

  private deleteTask(): void {
    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => {
        this.taskDeleted.emit();
      },
      error: (error) => {
        console.error("Error deleting task:", error);
      },
    });
  }

  getPriorityColor(priority?: TaskPriority): string {
    switch (priority) {
      case TaskPriority.HIGH:
        return "warn";
      case TaskPriority.MEDIUM:
        return "accent";
      case TaskPriority.LOW:
        return "primary";
      default:
        return "";
    }
  }

  getPriorityIcon(priority?: TaskPriority): string {
    switch (priority) {
      case TaskPriority.HIGH:
        return "keyboard_arrow_up";
      case TaskPriority.MEDIUM:
        return "drag_handle";
      case TaskPriority.LOW:
        return "keyboard_arrow_down";
      default:
        return "drag_handle";
    }
  }
}
