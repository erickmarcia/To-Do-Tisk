import { ITaskRepository } from "application/interfaces/ITaskRepository";
import { COLLECTIONS, db } from "config/firebase";
import { Task } from "domain/entities/Task";
import { TaskId } from "domain/value-objects/TaskId";
import { UserId } from "domain/value-objects/UserId";

export class FirestoreTaskRepository implements ITaskRepository {
  private readonly collectionName = COLLECTIONS.TASKS;

  async save(task: Task): Promise<Task> {
    try {
      const docRef = db.collection(this.collectionName).doc();
      const taskData = {
        userId: task.userId.value,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      };

      await docRef.set(taskData);

      return new Task(
        new TaskId(docRef.id),
        task.userId,
        task.title,
        task.description,
        task.status,
        task.createdAt,
        task.updatedAt
      );
    } catch (error) {
      console.error("Error saving task:", error);
      throw new Error("Failed to save task");
    }
  }

  async findById(id: TaskId): Promise<Task | null> {
    try {
      const docRef = db.collection(this.collectionName).doc(id.value);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return null;
      }

      const data = docSnap.data()!;
      return new Task(
        new TaskId(docSnap.id),
        new UserId(data.userId),
        data.title,
        data.description,
        data.status,
        data.createdAt.toDate(),
        data.updatedAt.toDate()
      );
    } catch (error) {
      console.error("Error finding task by id:", error);
      throw new Error("Failed to find task");
    }
  }

  async findByUserId(userId: UserId): Promise<Task[]> {
    try {
      const querySnapshot = await db
        .collection(this.collectionName)
        .where("userId", "==", userId.value)
        .get();

      const tasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push(
          new Task(
            new TaskId(doc.id),
            new UserId(data.userId),
            data.title,
            data.description,
            data.status, 
            data.createdAt.toDate(),
            data.updatedAt.toDate()
          )
        );
      });

      return tasks;
    } catch (error) {
      console.error("Error finding tasks by user id:", error);
      throw new Error("Failed to find tasks");
    }
  }

  async update(id: TaskId, updates: Partial<Task>): Promise<Task | null> {
    try {
      const docRef = db.collection(this.collectionName).doc(id.value);

      const updateData: any = { updatedAt: new Date() };

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined)
        updateData.description = updates.description;
      if (updates.status !== undefined) updateData.status = updates.status; 

      await docRef.update(updateData);

      return await this.findById(id);
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task");
    }
  }

  async delete(id: TaskId): Promise<void> {
    try {
      const docRef = db.collection(this.collectionName).doc(id.value);
      await docRef.delete();
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task");
    }
  }
}
