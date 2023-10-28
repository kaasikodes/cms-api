import { check } from "express-validator";

export default {
  createCategorySchema: [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name is required.")
      .trim()
      .isLength({ min: 3, max: 200 }),
    check("name").not().isEmpty().withMessage("Name is required.").trim(),
  ],
  updateCategorySchema: [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name is required.")
      .trim()
      .isLength({ min: 3, max: 200 }),
    check("name").not().isEmpty().withMessage("Name is required.").trim(),
  ],
};
