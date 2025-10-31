// middlewares/validators/registerValidator.js
const { body } = require("express-validator");

const registerValidationRules = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  body("phone").optional().trim(),
  body("company").optional().trim(),
  body("profession").optional().trim(),
];

module.exports = registerValidationRules;
