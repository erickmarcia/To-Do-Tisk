// core/auth/auth.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";

export interface User {
  id?: string;
  email: string;
  name?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface LoginResponse {
  success: boolean;
  data: User;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar si hay un usuario guardado en localStorage al inicializar
    this.loadUserFromStorage();
  }

  // Getter para verificar si el usuario está autenticado
  get isAuthenticated(): boolean {
     const userId = localStorage.getItem("userId");
     const currentUser = this.currentUserSubject.value;

     // Verificar tanto que existe userId como que hay un usuario actual
     return !!(userId && currentUser);
    // return this.currentUserSubject.value !== null;
  }

  // Getter para obtener el usuario actual
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Método para verificar la salud de la API
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`).pipe(
      tap((response) => console.log("API Health Check:", response)),
      catchError(this.handleError)
    );
  }

  // Buscar usuario por email
  findUserByEmail(email: string): Observable<User> {
    const url = `${this.apiUrl}/users/${encodeURIComponent(email)}`;

    return this.http.get<User>(url).pipe(
      tap((user) => console.log("Usuario encontrado:", user)),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  // Login de usuario
  login(email: string): Observable<LoginResponse> {
    const url = `${this.apiUrl}/users/${email}`;
    const body = { email };

     return this.http.get<LoginResponse>(url).pipe(
       tap((response) => {
         if (response.success) {
           const user = response.data;
           // Guardar userId en localStorage
           //  localStorage.setItem("userId", user.id ?? "");
           if (typeof user.id === "string" && user.id.trim()) {
             localStorage.setItem("userId", user.id);
           }
           this.setCurrentUser(user);
         }
       })
     );
  }

  // Crear nuevo usuario
  createUser(userData: {
    email: string;
    name?: string;
  }): Observable<AuthResponse> {
    const url = `${this.apiUrl}/users`;

    return this.http.post<AuthResponse>(url, userData).pipe(
      tap((response) => {
        if (response.success && response.user) {
        if (response.user.id) {
          localStorage.setItem("userId", response.user.id);
        }
        this.setCurrentUser(response.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Logout
  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem("currentUser");
      localStorage.removeItem("userId");
  }

  // Métodos privados
  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  private loadUserFromStorage(): void {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      localStorage.removeItem("currentUser");
    }
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = "Ha ocurrido un error desconocido";

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error ${error.status}: ${error.message}`;

      // Si hay un mensaje específico del servidor, usarlo
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.error) {
        errorMessage = error.error.error;
      }
    }

    return throwError(() => error);
  };

  // Método para actualizar el perfil del usuario
  updateProfile(userData: Partial<User>): Observable<AuthResponse> {
    if (!this.currentUser?.id) {
      return throwError(() => new Error("Usuario no autenticado"));
    }

    const url = `${this.apiUrl}/users/${this.currentUser.id}`;

    return this.http.put<AuthResponse>(url, userData).pipe(
      tap((response) => {
        if (response.success && response.user) {
          this.setCurrentUser(response.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Método para refrescar los datos del usuario
  refreshUser(): Observable<User> {
    if (!this.currentUser?.email) {
      return throwError(() => new Error("Usuario no autenticado"));
    }

    return this.findUserByEmail(this.currentUser.email).pipe(
      tap((user) => this.setCurrentUser(user))
    );
  }
}
