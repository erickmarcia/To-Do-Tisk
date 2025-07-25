import { Email } from "../value-objects/Email";
import { UserId } from "../value-objects/UserId";

export class User {
  constructor(
    private readonly _id: UserId,
    private readonly _email: Email,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  get id(): UserId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateTimestamp(): void {
    this._updatedAt = new Date();
  }

  toPlainObject() {
    return {
      id: this._id.value,
      email: this._email.value,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static create(email: string, id?: string): User {
    const userId = new UserId(id || "");
    const userEmail = new Email(email);
    const now = new Date();

    return new User(userId, userEmail, now, now);
  }
}
