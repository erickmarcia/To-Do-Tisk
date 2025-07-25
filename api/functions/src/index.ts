import * as functions from "firebase-functions";
import "dotenv/config"; 
import { app } from "./infrastructure/web/app";

// Load environment variables for local development
if (process.env.NODE_ENV === "development" || process.env.FUNCTIONS_EMULATOR) {
  require("dotenv").config();
}

// Export the Express app as a Firebase Function using v1 (más estable)
export const api = functions.https.onRequest(app);

