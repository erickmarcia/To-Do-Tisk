import { Email } from "../value-objects/Email";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID"; // O UserId
import { Name } from "domain/value-objects/Name";
import { UserDto } from "presentation/dto/UserDto";

export class User {
  public id: UniqueEntityID; // O UserId
  public readonly email: Email;
  // public readonly name?: Name;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(
    id: UniqueEntityID, // O UserId
    email: Email,
    // name?: Name,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.email = email;
    // this.name = name;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(email: string): User {
    const emailVO = new Email(email);

    return new User(new UniqueEntityID(), emailVO);
  }

  public assignId(id: string): void {
    if (this.id && this.id.value && this.id.value !== "") {
      throw new Error("Cannot reassign ID to an already existing entity.");
    }
    this.id = new UniqueEntityID(id); // Crea una nueva instancia de UniqueEntityID con el ID de Firestore
  }

  public toPersistence(): {
    id?: string;
    email: string;
    // name?: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      email: this.email.value,
      // name: this.name ? this.name.value : undefined,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toDTO(): UserDto {
    return {
      id: this.id.value,
      email: this.email.value,
      // name: this.name?.value || "",
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Método para reconstruir desde la persistencia (Firestore)
  static fromPersistence(
    id: string,
    email: string,
    // name?: string,
    createdAt?: Date,
    updatedAt?: Date
  ): User {
    const emailVO = new Email(email);
    // const nameVO = name ? new Name(name) : undefined;
    return new User(
      new UniqueEntityID(id), // O UserId(id)
      emailVO,
      // nameVO,
      createdAt ? new Date(createdAt) : undefined,
      updatedAt ? new Date(updatedAt) : undefined
    );
  }
}
