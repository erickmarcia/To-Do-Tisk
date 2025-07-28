// src/app/core/http/error.interceptor.ts
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      console.error("HTTP Error:", error);

      if (error.status === 401) {
        // Unauthorized - redirect to login
        router.navigate(["/login"]);
      }

      return throwError(() => error);
    })
  );
};
