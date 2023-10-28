import { check } from "express-validator";

export default {
  updateUserSchema: [
    check("name")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Name is required.")
      .trim()
      .isLength({ min: 3, max: 45 }),
  ],
};
