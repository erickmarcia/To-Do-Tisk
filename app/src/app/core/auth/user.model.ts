// angular-app/src/app/core/auth/user.model.ts
export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface CreateUserRequest {
  email: string;
  displayName?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}
