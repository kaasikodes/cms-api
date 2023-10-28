import { Router } from "express";
import categoryController from "../../../controllers/category";
import authMiddleware from "../../../middleware/authHandler";
import catgorySchemas from "../../../validation/category";
import validator from "../../../middleware/validator";

const categoryRouter = Router();
const {
  createCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
  getCategory,
} = categoryController;
const { verifyAuthToken } = authMiddleware;
const { updateCategorySchema, createCategorySchema } = catgorySchemas;

categoryRouter.post(
  "/create",
  verifyAuthToken,
  validator(createCategorySchema),
  createCategory
);
categoryRouter.patch(
  "/:id/update",
  verifyAuthToken,
  validator(updateCategorySchema),
  updateCategory
);
categoryRouter.delete("/:id/delete", verifyAuthToken, deleteCategory);
categoryRouter.get("/:id", verifyAuthToken, getCategory);
categoryRouter.get(
  "/",

  verifyAuthToken,
  getAllCategories
);

export default categoryRouter;
