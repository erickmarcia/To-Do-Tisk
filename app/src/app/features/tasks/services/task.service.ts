// src/app/features/tasks/services/task.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { catchError, tap, map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { AuthService } from "../../../core/auth/auth.service";
import { Task, TaskPriority } from "../models/task";

export interface CreateTaskRequest {
  userId: string;
  title: string;
  description: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: TaskPriority;
  completed?: boolean;
}

export interface TaskResponse {
  success: boolean;
  data: Task;
  message?: string;
}

export interface TasksResponse {
  success: boolean;
  data: Task[];
  message?: string;
}

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private apiUrl = environment.apiUrl;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Getter para obtener el userId del usuario autenticado
  private get currentUserId(): string | null {
    const userId = localStorage.getItem("userId");
    const currentUser = this.authService.currentUser;

    if (userId && currentUser?.id === userId) {
      return userId;
    }

    return null;
  }

  // Cargar todas las tareas del usuario
  loadTasks(): Observable<Task[]> {
    const userId = this.currentUserId;

    if (!userId) {
      return throwError(() => new Error("Usuario no autenticado"));
    }

    const url = `${this.apiUrl}/tasks?userId=${userId}`;

    return this.http.get<TasksResponse>(url).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.tasksSubject.next(response.data);
        }
      }),
      map((response) => {
        if (response.success) {
          return response.data || [];
        } else {
          throw new Error(response.message || "Error al cargar tareas");
        }
      }),
      catchError(this.handleError)
    );
  }

  // Crear nueva tarea
  createTask(taskData: Omit<CreateTaskRequest, "userId">): Observable<Task> {
    const userId = this.currentUserId;

    if (!userId) {
      return throwError(() => new Error("Usuario no autenticado"));
    }

    const url = `${this.apiUrl}/tasks`;
    const payload: CreateTaskRequest = {
      userId: userId,
      ...taskData
    };

    return this.http.post<TaskResponse>(url, payload).pipe(
      tap((response) => {
        if (response.success && response.data) {
          const currentTasks = this.tasksSubject.value;
          this.tasksSubject.next([...currentTasks, response.data]);
        }
      }),
      map((response) => {
        console.log("response",response);
        if (response.success && response.data ) {
          return response.data;
        } else {
          throw new Error(response.message || "Error al crear tarea");
        }
      }),
      catchError(this.handleError)
    );
  }

  // Actualizar tarea existente
  updateTask(taskId: string, updateData: UpdateTaskRequest): Observable<Task> {
    const userId = this.currentUserId;

    if (!userId) {
      return throwError(() => new Error("Usuario no autenticado"));
    }

    const url = `${this.apiUrl}/tasks/${taskId}`;

    return this.http.put<TaskResponse>(url, updateData).pipe(
      tap((response) => {
        if (response.success && response.data) {
          // Actualizar la tarea en la lista existente
          const currentTasks = this.tasksSubject.value;
          const updatedTasks = currentTasks.map((task) =>
            task.id === taskId ? response.data : task
          );
          this.tasksSubject.next(updatedTasks);
        }
      }),
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || "Error al actualizar tarea");
        }
      }),
      catchError(this.handleError)
    );
  }

  // Eliminar tarea
  deleteTask(taskId: string): Observable<boolean> {
    const userId = this.currentUserId;

    if (!userId) {
      return throwError(() => new Error("Usuario no autenticado"));
    }

    const url = `${this.apiUrl}/tasks/${taskId}`;


    return this.http.delete<{ success: boolean; message?: string }>(url).pipe(
      tap((response) => {
      
        if (response.success) {
          // Remover la tarea de la lista existente
          const currentTasks = this.tasksSubject.value;
          const filteredTasks = currentTasks.filter(
            (task) => task.id !== taskId
          );
          this.tasksSubject.next(filteredTasks);
        }
      }),
      map((response) => {
        if (response.success) {
          return true;
        } else {
          throw new Error(response.message || "Error al eliminar tarea");
        }
      }),
      catchError(this.handleError)
    );
  }

  // Alternar estado completado de una tarea
  toggleTaskComplete(taskId: string): Observable<Task> {
    const currentTasks = this.tasksSubject.value;
    const task = currentTasks.find((t) => t.id === taskId);

    if (!task) {
      return throwError(() => new Error("Tarea no encontrada"));
    }

    return this.updateTask(taskId, { completed: !task.completed });
  }

  // Obtener tareas filtradas por estado
  getTasksByStatus(completed: boolean): Observable<Task[]> {
    return this.tasks$.pipe(
      map((tasks) => tasks.filter((task) => task.completed === completed))
    );
  }

  // Obtener estadísticas de tareas
  getTaskStats(): Observable<{
    total: number;
    completed: number;
    pending: number;
  }> {
    return this.tasks$.pipe(
      map((tasks) => ({
        total: tasks.length,
        completed: tasks.filter((t) => t.completed).length,
        pending: tasks.filter((t) => !t.completed).length,
      }))
    );
  }

  // Limpiar tareas (útil para logout)
  clearTasks(): void {
    this.tasksSubject.next([]);
  }

  // Manejo de errores
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = "Ha ocurrido un error desconocido";

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 401:
          errorMessage = "No autorizado. Por favor, inicie sesión nuevamente.";
          break;
        case 403:
          errorMessage = "No tiene permisos para realizar esta acción.";
          break;
        case 404:
          errorMessage = "Recurso no encontrado.";
          break;
        case 500:
          errorMessage = "Error interno del servidor.";
          break;
        default:
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          } else {
            errorMessage = `Error ${error.status}: ${error.message}`;
          }
      }
    }

    return throwError(() => new Error(errorMessage));
  };
}
