import { Router } from "express";
import userController from "../../../controllers/user";
import authMiddleware from "../../../middleware/authHandler";
import userSchemas from "../../../validation/user";
import validator from "../../../middleware/validator";

const userRouter = Router();
const { getAllUsers, updateUser, getUser, deleteUser } = userController;
const { verifyAuthToken } = authMiddleware;
const { updateUserSchema } = userSchemas;

userRouter.patch(
  "/:id/update",
  verifyAuthToken,
  validator(updateUserSchema),
  updateUser
);
userRouter.delete("/:id/delete", verifyAuthToken, deleteUser);
userRouter.get("/:id", verifyAuthToken, getUser);
userRouter.get(
  "/",

  verifyAuthToken,
  getAllUsers
);

export default userRouter;
