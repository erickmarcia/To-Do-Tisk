import { ValidationError } from "../errors/ValidationError";

export class Email {
  private readonly _value: string;

  constructor(email: string) {
    if (!email || email.trim() === "") {
      throw new ValidationError("Email is required");
    }

    const trimmedEmail = email.trim();

    if (!this.isValid(trimmedEmail)) {
      throw new ValidationError("Invalid email format");
    }

    this._value = trimmedEmail.toLowerCase();
  }

  get value(): string {
    return this._value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    return isValid;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
