// src/app/core/shared/directives/focus-trap.directive.ts
import { Directive, ElementRef, OnInit, OnDestroy } from "@angular/core";

@Directive({
  selector: "[appFocusTrap]",
  standalone: true,
})
export class FocusTrapDirective implements OnInit, OnDestroy {
  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.setFocusableElements();
    this.trapFocus();
  }

  ngOnDestroy(): void {
    // Clean up event listeners if needed
  }

  private setFocusableElements(): void {
    const focusableElements = this.elementRef.nativeElement.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );

    if (focusableElements.length > 0) {
      this.firstFocusableElement = focusableElements[0];
      this.lastFocusableElement =
        focusableElements[focusableElements.length - 1];
    }
  }

  private trapFocus(): void {
    this.elementRef.nativeElement.addEventListener(
      "keydown",
      (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (
            e.shiftKey &&
            document.activeElement === this.firstFocusableElement
          ) {
            e.preventDefault();
            this.lastFocusableElement?.focus();
          } else if (
            !e.shiftKey &&
            document.activeElement === this.lastFocusableElement
          ) {
            e.preventDefault();
            this.firstFocusableElement?.focus();
          }
        }
      }
    );
  }
}
