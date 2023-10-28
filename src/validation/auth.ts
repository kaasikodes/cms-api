import { check } from "express-validator";

export default {
  signupSchema: [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name is required.")
      .trim()
      .isLength({ min: 3, max: 45 }),
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email address is required.")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email address."),

    check("password")
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Password is required.")
      .isLength({ min: 8, max: 45 })
      .withMessage("Password should be between 8 to 45 characters.")
      .matches("[0-9]")
      .withMessage("Password must contain a number.")
      .matches("[A-Z]")
      .withMessage("Password must contain an uppercase letter.")
      .matches("[a-z]")
      .withMessage("New password must contain a lowercase letter."),
  ],

  loginSchema: [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email address is required.")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email address."),

    check("password").not().isEmpty().withMessage("Password is required."),
  ],

  forgotPasswordSchema: [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email address is required.")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email address."),
  ],

  resetPasswordSchema: [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email address is required.")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email address."),
    check("newPassword")
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("New password is required.")
      .isLength({ min: 8, max: 45 })
      .withMessage("New password should be between 8 to 45 characters.")
      .matches("[0-9]")
      .withMessage("New password must contain a number.")
      .matches("[A-Z]")
      .withMessage("New password must contain an uppercase letter.")
      .matches("[a-z]")
      .withMessage("New password must contain a lowercase letter."),
  ],
};
