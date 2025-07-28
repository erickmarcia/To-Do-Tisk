# 📋 To-Do Tisk API

Esta es una API para gestionar tareas, construida con Node.js y Firebase Functions, conectada a Firestore. Incluye funcionalidades para crear, listar, actualizar y eliminar tareas.

## 🚀 Requisitos

- [Node.js v20](https://nodejs.org/)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [NVM](https://github.com/nvm-sh/nvm) para gestionar versiones de Node.js

## 🔧 Configuración local

Sigue estos pasos para levantar el proyecto en tu máquina local:

### 1. Instalar y usar Node.js 20

```bash
nvm install 20
nvm use 20
```

2. Instalar dependencias y compilar

Entra a la carpeta functions y ejecuta:

```bash
cd functions
npm install
npm run build
```

3. Iniciar los emuladores de Firebase

Puedes iniciar todos los emuladores necesarios con

```bash
firebase emulators:start
```

O bien, iniciar solo funciones y Firestore:

```bash
npx firebase emulators:start --only functions,firestore
```

Esto levantará los servicios en http://localhost:5001 (funciones) y http://localhost:8080 (Firestore).

☁️ Despliegue

Para publicar tu API en Firebase, ejecuta desde la raíz del proyecto:

```bash
firebase deploy
```

Este comando subirá tus funciones y recursos a tu proyecto en Firebase.

📁 Estructura del proyecto

```bash
/ (raíz)
├── firebase.json
├── .firebaserc
├── functions/
│   ├── src/
│   ├── lib/
│   ├── package.json
│   └── ...
├── firebase.json
├── .firebaserc
└── README.md
```

🛠️ Endpoints (Ejemplos)
• POST /tasks – Crea una nueva tarea.
• GET /tasks – Lista todas las tareas.
• PUT /tasks/:id – Actualiza una tarea existente.
• DELETE /tasks/:id – Elimina una tarea.

Todos los endpoints están disponibles a través de Cloud Functions y expuestos vía Firebase Hosting o directamente por URL de funciones.

✍️ Autor

Erick Marcia
