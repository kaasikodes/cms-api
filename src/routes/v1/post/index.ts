import { Router } from "express";
import postController from "../../../controllers/post";
import authMiddleware from "../../../middleware/authHandler";
import postSchemas from "../../../validation/post";
import validator from "../../../middleware/validator";

const postRouter = Router();
const { createPost, deletePost, getAllPosts, getPost, updatePost } =
  postController;
const { verifyAuthToken } = authMiddleware;
const { updatePostSchema, createPostSchema } = postSchemas;

postRouter.post(
  "/create",
  verifyAuthToken,
  validator(createPostSchema),
  createPost
);
postRouter.patch(
  "/:id/update",
  verifyAuthToken,
  validator(updatePostSchema),
  updatePost
);
postRouter.delete("/:id/delete", verifyAuthToken, deletePost);
postRouter.get("/:id", verifyAuthToken, getPost);
postRouter.get(
  "/",

  verifyAuthToken,
  getAllPosts
);

export default postRouter;
