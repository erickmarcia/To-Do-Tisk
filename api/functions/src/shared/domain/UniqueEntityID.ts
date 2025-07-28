import { v4 as uuidv4 } from "uuid"; // If you're using 'uuid' package

export class UniqueEntityID {
  public readonly value: string;

  constructor(id?: string) {
    this.value = id || uuidv4();
  }

  equals(id?: UniqueEntityID): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof UniqueEntityID)) {
      return false;
    }
    return this.value === id.value;
  }

  toString(): string {
    return this.value;
  }
}
