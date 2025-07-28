// src/app/features/tasks/components/task-form/task-form.component.ts
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  Optional,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";

import { TaskService } from "../../services/task.service";
import { Task, TaskPriority } from "../../models/task";
import Swal from "sweetalert2";

interface TaskFormData {
  task?: Task;
}

@Component({
  selector: "app-task-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: "./task-form.component.html",
  styleUrls: ["./task-form.component.scss"],
})
export class TaskFormComponent implements OnInit {
  @Output() taskCreated = new EventEmitter<Task>();

  taskForm: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  taskToEdit?: Task;

  priorities = [
    {
      value: TaskPriority.LOW,
      label: "Baja",
      icon: "keyboard_arrow_down",
      color: "primary",
    },
    {
      value: TaskPriority.MEDIUM,
      label: "Media",
      icon: "drag_handle",
      color: "accent",
    },
    {
      value: TaskPriority.HIGH,
      label: "Alta",
      icon: "keyboard_arrow_up",
      color: "warn",
    },
  ];

  categories = [
    "Trabajo",
    "Personal",
    "Salud",
    "Educación",
    "Finanzas",
    "Hogar",
    "Viajes",
    "Otros",
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: TaskFormData | null,
    @Optional() public dialogRef: MatDialogRef<TaskFormComponent> | null
  ) {
    this.taskForm = this.createForm();

    if (this.data?.task) {
      this.isEditMode = true;
      this.taskToEdit = this.data.task;
    }
  }

  ngOnInit(): void {
    if (this.isEditMode && this.taskToEdit) {
      this.populateForm(this.taskToEdit);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
      description: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(500),
        ],
      ],
      category: [""],
      priority: [TaskPriority.MEDIUM],
    });
  }

  private populateForm(task: Task): void {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      category: task.category || "",
      priority: task.priority || TaskPriority.MEDIUM,
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      if (this.isEditMode && this.taskToEdit) {
        this.updateTask();
      } else {
        this.createTask();
      }
    }
  }

  private createTask(): void {
    const formValue = this.taskForm.value;
    const taskData = {
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      category: formValue.category || undefined,
      priority: formValue.priority,
    };

    this.taskService.createTask(taskData).subscribe({
      next: (newTask) => {
        this.isSubmitting = false;
         console.log("Tarea creada:", newTask); 
         Swal.fire({
           toast: true,
           icon: "success",
           title: "Tarea creada exitosamente!",
           timer: 3000,
           showConfirmButton: false,
           position: "top-end",
         });
        this.taskCreated.emit(newTask);
        this.resetForm();

        // Close dialog if we're in dialog mode
        // if (this.dialogRef) {
        //   this.dialogRef.close(newTask);
        // }
      },
      error: (error) => {
        this.isSubmitting = false;
       },
    });
  }

  private updateTask(): void {
    if (!this.taskToEdit) return;

    const formValue = this.taskForm.value;
    const updateData = {
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      category: formValue.category || undefined,
      priority: formValue.priority,
    };

    this.taskService.updateTask(this.taskToEdit.id, updateData).subscribe({
      next: (updatedTask) => {
        this.isSubmitting = false;

        if (this.dialogRef) {
          this.dialogRef.close(updatedTask);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
      },
    });
  }

  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.taskForm.reset({
      priority: TaskPriority.MEDIUM,
    });
    this.taskForm.markAsUntouched();
  }

  // Getters for form validation
  get title() {
    return this.taskForm.get("title");
  }
  get description() {
    return this.taskForm.get("description");
  }
  get category() {
    return this.taskForm.get("category");
  }
  get priority() {
    return this.taskForm.get("priority");
  }
}
