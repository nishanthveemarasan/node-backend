import { body } from "express-validator";
import UserModal from "../models/user.js";
export const singupValidator = [
  body("email")
    .isEmail()
    .custom(async (value, { req }) => {
      const userExists = await UserModal.findByEmail(value);
      console.log(userExists);
      if (userExists) {
        throw new Error("User already exists");
      }
      return true;
    })
    .normalizeEmail(),
  body(
    "password",
    "Password must be at least 6 characters long and contain a number, uppercase letter, lowercase letter, and special character"
  )
    .isLength({ min: 6 })
    .matches(/\d/)
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/[@$!%*?&]/)
    .custom((value, { req }) => {
      if (value !== req.body.password_confirmation) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    })
    .trim(),
];


export const loginValidator = [
  body("username").isEmail(),
  body("password", "Password is required")
        .notEmpty(),
];
