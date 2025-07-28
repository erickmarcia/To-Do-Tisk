import { v4 as uuidv4 } from "uuid";

export class UserId {
  public readonly value: string;

  constructor(id?: string) {
    this.value = id || uuidv4();
  }

  equals(other: UserId): boolean {
    return other instanceof UserId && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
