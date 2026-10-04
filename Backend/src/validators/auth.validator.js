import { body } from "express-validator";

export const registerValidation=[
  body("fullName")
  .trim()
  .notEmpty()
  .withMessage("Full name is required")
   .bail()
  .isLength({ min: 3, max: 50 })
  .withMessage("Full name must be between 3 and 50 characters"),

  body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
   .bail()
  .isEmail()
  .withMessage("Please enter a valid email")
  .normalizeEmail(),

   body("password")
  .notEmpty()
  .withMessage("Password is required")
   .bail()
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters"),
]

export const loginValidation=[
  body("email").trim().notEmpty().withMessage("Email is required").bail().isEmail().withMessage("Please enter a valid email").normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password is required"),
]