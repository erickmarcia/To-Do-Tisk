// src/app/core/shared/pipes/short-date.pipe.ts
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "shortDate",
  standalone: true,
})
export class ShortDatePipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return "";

    const date = typeof value === "string" ? new Date(value) : value;
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString("es-ES", {
        weekday: "short",
      });
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  }
}
