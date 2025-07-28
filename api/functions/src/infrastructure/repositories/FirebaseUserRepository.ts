import { IUserRepository } from "../../application/interfaces/IUserRepository";
import { User } from "../../domain/entities/User";
import { Email } from "../../domain/value-objects/Email";

import { getFirestore } from "firebase-admin/firestore";
import { UniqueEntityID } from "shared/domain/UniqueEntityID";

export class FirebaseUserRepository implements IUserRepository {
  private db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = getFirestore();
  }

  async save(user: User): Promise<User> {
    try {
      const usersRef = this.db.collection("users");
      const dataToSave = user.toPersistence();

      // VERIFICAMOS SI EL DOCUMENTO YA EXISTE EN FIRESTORE
      let docRef: FirebaseFirestore.DocumentReference;
      let isExistingUserInFirestore = false;

      if (user.id && user.id.value) {
        docRef = usersRef.doc(user.id.value);
        const docSnapshot = await docRef.get();
        if (docSnapshot.exists) {
          isExistingUserInFirestore = true;
        }
      }

      if (isExistingUserInFirestore) {
        await docRef!.update(dataToSave);
      } else {
        const newDocRef = await usersRef.add(dataToSave);
        user.assignId(newDocRef.id);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: Email): Promise<User | null> {
    try {
      const usersRef = this.db.collection("users");
      const snapshot = await usersRef
        .where("email", "==", email.value)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const userData = snapshot.docs[0].data();

      return User.fromPersistence(
        snapshot.docs[0].id,
        userData.email,
        // userData.name,
        userData.createdAt,
        userData.updatedAt
      );
    } catch (error) {
      throw error;
    }
  }

  async findById(id: UniqueEntityID): Promise<User | null> {
    try {
      const doc = await this.db.collection("users").doc(id.value).get();
      if (!doc.exists) {
        return null;
      }
      const userData = doc.data();
      return User.fromPersistence(
        doc.id,
        userData?.email,
        // userData?.name,
        userData?.createdAt,
        userData?.updatedAt
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(id: UniqueEntityID): Promise<void> {
    try {
      await this.db.collection("users").doc(id.value).delete();
    } catch (error) {
      throw error;
    }
  }
}
