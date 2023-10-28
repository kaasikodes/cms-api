import { Router } from "express";
import authController from "../../../controllers/auth";
import authMiddleware from "../../../middleware/authHandler";
import validator from "../../../middleware/validator";
import authSchemas from "../../../validation/auth";

const authRouter = Router();
const { signup, login, resetPassword, forgotPassword, logout } = authController;
const { verifyResetPasswordToken, verifyAuthToken } = authMiddleware;
const {
  signupSchema,
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  logoutSchema,
} = authSchemas;

authRouter.post("/signup", validator(signupSchema), signup);
authRouter.post("/login", validator(loginSchema), login);
authRouter.post(
  "/forgot-password",
  validator(forgotPasswordSchema),
  forgotPassword
);
authRouter.post(
  "/reset-password",
  validator(resetPasswordSchema),
  verifyResetPasswordToken,
  resetPassword
);
authRouter.post("/logout", validator(logoutSchema), verifyAuthToken, logout);

export default authRouter;
