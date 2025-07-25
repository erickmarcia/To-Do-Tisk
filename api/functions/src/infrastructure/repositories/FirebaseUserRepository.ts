import { COLLECTIONS, db } from "config/firebase";
import { IUserRepository } from "../../application/interfaces/IUserRepository";
import { User } from "../../domain/entities/User";
import { Email } from "../../domain/value-objects/Email";
import { UserId } from "../../domain/value-objects/UserId";

export class FirebaseUserRepository implements IUserRepository {
  private readonly collectionName = COLLECTIONS.USERS;

  async findById(id: UserId): Promise<User | null> {
    try {
      const docRef = db.collection(this.collectionName).doc(id.value);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return null;
      }

      const data = docSnap.data()!;
      return new User(
        new UserId(docSnap.id),
        new Email(data.email),
        data.createdAt.toDate(),
        data.updatedAt.toDate()
      );
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw new Error("Failed to find user");
    }
  }

  async findByEmail(email: Email): Promise<User | null> {
    try {
      const querySnapshot = await db
        .collection(this.collectionName)
        .where("email", "==", email.value)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();

      return new User(
        new UserId(doc.id),
        new Email(data.email),
        data.createdAt.toDate(),
        data.updatedAt.toDate()
      );
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Failed to find user");
    }
  }

  async save(user: User): Promise<void> {
    try {
      const docRef = db.collection(this.collectionName).doc();
      const userData = {
        email: user.email.value,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      await docRef.set(userData);

      // Asignar el ID generado al objeto user
      Object.defineProperty(user, "_id", {
        value: new UserId(docRef.id),
        writable: false,
      });
    } catch (error) {
      console.error("Error saving user:", error);
      throw new Error("Failed to save user");
    }
  }

  async update(user: User): Promise<void> {
    try {
      const docRef = db.collection(this.collectionName).doc(user.id.value);
      const updateData = {
        email: user.email.value,
        updatedAt: user.updatedAt,
      };

      await docRef.update(updateData);
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }
}
