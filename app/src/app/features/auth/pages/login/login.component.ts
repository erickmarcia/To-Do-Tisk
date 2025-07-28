// src/app/features/auth/pages/login/login.component.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";

import { AuthService } from "../../../../core/auth/auth.service";
import { ConfirmDialogComponent } from "../../../../core/shared/components/confirm-dialog/confirm-dialog.component";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    // Si el usuario ya está autenticado, redirigir a tasks
    if (this.authService.isAuthenticated) {
      this.router.navigate(["/tasks"]);
    }

    // Test de conectividad con la API
    // this.testApiConnection();
  }

  private testApiConnection(): void {
    this.authService.healthCheck?.().subscribe({
      next: (response) => {
        console.log("✅ API conectada correctamente:", response);
      },
      error: (error) => {
        console.error("❌ Error de conexión con API:", error);
        this.showError(
          "Error de conexión con el servidor. Verifique su conexión a internet."
        );
      },
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const email = this.loginForm.get("email")?.value;

      // Buscar si el usuario existe
      this.authService.findUserByEmail(email).subscribe({
        next: (user) => {
          // Usuario existe, proceder con login
          this.login(email);
        },
        error: (error: HttpErrorResponse) => {
          // Verificar si es un error 404 (usuario no encontrado)
          if (error.status === 404) {
            this.showCreateUserDialog(email);
          } else {
            // Otro tipo de error (500, red, etc.)
            this.isLoading = false;
            this.handleApiError(error);
          }
        },
      });
    }
  }

  private login(email: string): void {
    this.authService.login(email).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success && response.data) {
          const userEmail = response.data.email || email;

          this.showSuccess(`¡Bienvenido de vuelta, ${userEmail}!`);

          // Usar setTimeout para asegurar que el estado se actualice antes de navegar
          setTimeout(() => {
            this.router.navigate(["/tasks"]);
          }, 100);
        } else {
          this.showError("Error en la respuesta del servidor");
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.handleApiError(error, "Error al iniciar sesión");
      },
    });
  }

  private showCreateUserDialog(email: string): void {
    this.isLoading = false;

    Swal.fire({
      title: "Crear Nueva Cuenta",
      text: `El email "${email}" no está registrado. ¿Te gustaría crear una nueva cuenta?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ff6600",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, Crear Cuenta",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.createUser(email);
      } else {
        // console.log("❌ Usuario canceló la creación de cuenta");
      }
    });
  }

  private createUser(email: string): void {
    this.isLoading = true;

    this.authService.createUser({ email }).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success && response.user) {
         
          this.showSuccess(
            `¡Cuenta creada exitosamente! ¡Bienvenido, ${
              response.user.email || email
            }!`
          );

          // Usar setTimeout para asegurar que el estado se actualice antes de navegar
          setTimeout(() => {
            this.router.navigate(["/tasks"]);
          }, 100);
        } else {
          this.showError("Error al crear la cuenta");
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.handleApiError(error, "Error al crear la cuenta");
      },
    });
  }

  private handleApiError(
    error: HttpErrorResponse,
    customMessage?: string
  ): void {
    let message = customMessage || "Ha ocurrido un error";

    switch (error.status) {
      case 0:
        message = "Error de conexión. Verifique su conexión a internet.";
        break;
      case 400:
        message = "Datos inválidos. Verifique la información ingresada.";
        break;
      case 401:
        message = "No autorizado. Verifique sus credenciales.";
        break;
      case 403:
        message = "Acceso denegado.";
        break;
      case 404:
        message = "Recurso no encontrado.";
        break;
      case 500:
        message = "Error interno del servidor. Intente más tarde.";
        break;
      case 503:
        message = "Servicio no disponible. Intente más tarde.";
        break;
      default:
        if (error.error?.message) {
          message = error.error.message;
        } else if (error.error?.error) {
          message = error.error.error;
        }
    }

    this.showError(message);
  }

  /**
   * Muestra mensaje de error usando SweetAlert
   * @param message - Mensaje de error
   */
  private showError(message: string): void {
    Swal.fire({
      title: "Error",
      text: message,
      icon: "error",
      confirmButtonColor: "#ff6600",
      confirmButtonText: "Entendido",
      customClass: {
        popup: "swal2-popup-custom",
        title: "swal2-title-custom",
      },
    });
  }

  /**
   * Muestra mensaje de error usando SweetAlert
   * @param message - Mensaje de error
   */
  showSuccess(texto: string): void {
    // Swal.fire({
    //   position: "center",
    //   icon: "success",
    //   title: texto,
    //   showConfirmButton: false,
    //   timer: 1500,
    //   // panelClass: ["success-snackbar"],
    // })
    // .then(() => {
    //   this.router.navigate(["/tasks"]);
    // });

    Swal.fire({
      toast: true,
      icon: "success",
      title: texto,
      timer: 1500,
      showConfirmButton: false,
      position: "top-end",
    });

    this.router.navigate(["/tasks"]);
  }
}
