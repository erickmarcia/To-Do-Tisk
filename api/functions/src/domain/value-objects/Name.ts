export class Name {
  private readonly _value: string;

  constructor(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }
    this._value = name.trim();
  }

  get value(): string {
    return this._value;
  }

  private isValidName(name: string): boolean {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]{2,50}$/;
    return nameRegex.test(name.trim());
  }

  equals(other: Name): boolean {
    return this._value === other._value;
  }
}
