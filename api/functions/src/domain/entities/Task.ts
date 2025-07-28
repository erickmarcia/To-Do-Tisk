import { Timestamp } from "firebase-admin/firestore";
import { TaskId } from "../value-objects/TaskId";
import { UserId } from "../value-objects/UserId";
import { TaskStatus } from "../enums/TaskStatus";
import { TaskDto } from "presentation/dto/TaskDto";

export class Task {
  private _id: TaskId;
  private readonly _userId: UserId;
  private _title: string;
  private _description: string;
  private _category: string;
  private _priority: string;
  private _status: TaskStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string | TaskId,
    userId: string | UserId,
    title: string,
    description: string,
    category: string,
    priority: string,
    status: TaskStatus,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = typeof id === "string" ? new TaskId(id) : id;
    this._userId = typeof userId === "string" ? new UserId(userId) : userId;
    this._title = title;
    this._description = description;
    this._category = category;
    this._priority = priority;
    this._status = status;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): TaskId {
    return this._id;
  }
  get userId(): UserId {
    return this._userId;
  }
  get title(): string {
    return this._title;
  }
  get description(): string {
    return this._description;
  }
  get category(): string {
    return this._category;
  }
  get priority(): string {
    return this._priority;
  }
  get status(): TaskStatus {
    return this._status;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error("Task title cannot be empty");
    }
    this._title = title.trim();
    this.updateTimestamp();
  }

  updateDescription(description: string): void {
    this._description = description.trim();
    this.updateTimestamp();
  }

  updateCategory(category: string): void {
    this._category = category.trim();
    this.updateTimestamp();
  }

  updatePriority(priority: string): void {
    this._priority = priority.trim();
    this.updateTimestamp();
  }

  toggleCompleted(): void {
    this._status = TaskStatus.COMPLETED;
    this._updatedAt = new Date();
  }

  markAsCompleted(): void {
    this._status = TaskStatus.COMPLETED;
    this.updateTimestamp();
  }

  markAsPending(): void {
    this._status = TaskStatus.PENDING;
    this.updateTimestamp();
  }

  toggleStatus(): void {
    this._status =
      this._status === TaskStatus.COMPLETED
        ? TaskStatus.PENDING
        : TaskStatus.COMPLETED;
    this.updateTimestamp();
  }

  private updateTimestamp(): void {
    this._updatedAt = new Date();
  }

  // Método para convertir la entidad a un objeto compatible con Firestore
  toFirestore(): any {
    return {
      userId: this._userId.value,
      title: this._title,
      description: this._description,
      category: this._category,
      priority: this._priority,
      status: this._status,
      createdAt: Timestamp.fromDate(this._createdAt),
      updatedAt: Timestamp.fromDate(this._updatedAt),
    };
  }

  static fromFirestore(data: any, id: string): Task {
    if (!data) {
      throw new Error("Task data is undefined");
    }

    const createdAt =
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : data.createdAt;
    const updatedAt =
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : data.updatedAt;

    return new Task(
      id,
      data.userId,
      data.title,
      data.description || "",
      data.status as TaskStatus,
      data.category,
      data.priority,
      createdAt,
      updatedAt
    );
  }

  // Nota: Este método es para crear una nueva tarea antes de que tenga un ID de Firestore.
  // No debería aceptar 'id' como un parámetro obligatorio aquí, ya que el ID lo genera Firestore.
  static createNew(
    userId: string,
    title: string,
    description: string,
    category: string,
    priority: string
  ): Task {
    if (!title || title.trim().length === 0) {
      throw new Error("Task title is required");
    }

    const taskUserId = new UserId(userId);
    const now = new Date();

    // Genera un ID temporal único para evitar errores
    const tempId = `temp_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return new Task(
      new TaskId(tempId),
      taskUserId,
      title.trim(),
      description.trim(),
      category,
      priority,
      TaskStatus.PENDING,
      now,
      now
    );
  }

  toJSON() {
    return {
      id: this._id.value,
      userId: this._userId.value,
      title: this._title,
      description: this._description,
      category: this._category,
      priority: this.priority,
      status: this._status,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  toDTO(): TaskDto {
    return {
      id: this._id.value,
      userId: this._userId.value,
      title: this._title,
      description: this._description,
      category: this._category,
      priority: this.priority,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      completed: this._status === "completed",
    };
  }
}
