import * as admin from 'firebase-admin';

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

// Exportar la instancia de Firestore
export const db = admin.firestore();

// Constantes de colecciones
export const COLLECTIONS = {
  USERS: 'users',
  TASKS: 'tasks',
} as const;
