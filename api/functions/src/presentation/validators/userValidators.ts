import { body, param } from "express-validator";

export const createUserValidation = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
];

export const getUserByEmailValidation = [
  param("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
];
