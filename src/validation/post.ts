import { check } from "express-validator";

export default {
  createPostSchema: [
    check("title")
      .not()
      .isEmpty()
      .withMessage("Title is required.")
      .trim()
      .isLength({ min: 3, max: 200 }),
    check("content").not().isEmpty().withMessage("Content is required.").trim(),
  ],
  updatePostSchema: [
    check("title")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Title is required.")
      .trim()
      .isLength({ min: 3, max: 200 }),
    check("content")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Content is required.")
      .trim(),
  ],
};
