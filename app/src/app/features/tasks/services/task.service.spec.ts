// src/app/features/tasks/services/task.service.spec.ts
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TaskService } from "./task.service";
import { AuthService } from "../../../core/auth/auth.service";
import { Task, TaskPriority } from "../models/task";

describe("TaskService", () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  const mockUser = {
    id: "1",
    email: "test@example.com",
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };

  const mockTask: Task = {
    id: "1",
    userId: "1",
    title: "Test Task",
    description: "Test Description",
    completed: false,
    category: "personal",
    priority: TaskPriority.MEDIUM,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    status: ""
  };

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj("AuthService", ["currentUserValue"]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService, { provide: AuthService, useValue: authSpy }],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Mock the currentUserValue getter
    Object.defineProperty(authService, "currentUserValue", {
      get: () => mockUser,
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should load tasks", () => {
    const mockTasks = [mockTask];

    service.loadTasks().subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne((req) => req.url.includes("/tasks"));
    expect(req.request.method).toBe("GET");
    req.flush({ success: true, data: mockTasks });
  });

  it("should create task", () => {
    const createTaskRequest = {
      title: "New Task",
      description: "New Description",
      priority: TaskPriority.HIGH,
    };

    service.createTask(createTaskRequest).subscribe((task) => {
      expect(task).toEqual(mockTask);
    });

    const req = httpMock.expectOne((req) => req.url.includes("/tasks"));
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(createTaskRequest);
    req.flush({ success: true, data: mockTask });
  });
});
