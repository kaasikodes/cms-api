import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import {
  excludeTypesInModel,
  generateAuthToken,
  generatePasswordResetToken,
  sendResetPasswordEmail,
} from "../../helpers";
import { ENV } from "../../config/enviroment";

const prisma = new PrismaClient();

const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userAlreadyExists = await prisma.user.findFirst({
        where: {
          email: req.body.email,
        },
      });
      if (userAlreadyExists) {
        return res.status(400).json({
          status: "error",
          message: "User already exists",
          data: {},
        });
      }
      // Hash Password
      const userPassword = await bcrypt.hash(
        req.body.password,
        Number(ENV.SALT_ROUNDS)
      );
      // TODO: Validate Data
      const user = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          password: userPassword,
        },
      });
      const token = generateAuthToken({
        id: user.id,
        password: userPassword,
      });
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          currentSessionToken: token,
        },
      });
      return res.status(200).json({
        status: "success",
        message: "User created successfully!",
        data: {
          user: excludeTypesInModel(user, [
            "password",
            "pwdResetToken",
            "currentSessionToken",
          ]),

          token,
        },
      });
    } catch (error: any) {
      next(error);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });
      if (!user) {
        return res.status(400).json({
          status: "error",
          message: `No user exists with email provided!`,
          data: {},
        });
      }

      const isPasswordValid =
        user?.password &&
        (await bcrypt.compare(req.body.password, user?.password));
      if (!isPasswordValid) {
        return res.status(400).json({
          status: "error",
          message: `Password doesn't match`,
          data: {},
        });
      }

      // generate token
      const token = generateAuthToken({
        id: user.id,
        password: user.password,
      });
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          currentSessionToken: token,
        },
      });
      return res.status(200).json({
        status: "success",
        message: "User logged in successfully!",
        data: {
          user: excludeTypesInModel(user, [
            "password",
            "pwdResetToken",
            "currentSessionToken",
          ]),
          token,
        },
      });
    } catch (error: any) {
      next(error);
    }
  },
  forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });
      if (!user) {
        return res.status(400).json({
          status: "error",
          message: `A user with the email ${req.body.email} doesn't exist`,
          data: {},
        });
      }

      // generate token
      const resetToken = generatePasswordResetToken({
        id: user.id,
      });
      // update user passwordToken
      // TODO: fix issue
      await prisma.user.update({
        where: { id: user.id },
        data: {
          pwdResetToken: resetToken,
        },
      });
      sendResetPasswordEmail(user.email, resetToken);

      return res.status(200).json({
        status: "success",
        message: `Password reset link sent to ${req.body.email}  successfully!`,
        data: {
          resetToken, // TODO: Remove just for testing purposes
        },
      });
    } catch (error: any) {
      next(error);
    }
  },
  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });
      if (!user) {
        return res.status(400).json({
          status: "error",
          message: `A user with the email ${req.body.email} doesn't exist`,
          data: {},
        });
      }
      // verify reset token
      // check if token is expired and throw error
      // if token is valid update user password, with new password, and then create new token 4 user(ess. loggin user in)
      // delete passwordToken
      // Hash Password
      const userPassword = await bcrypt.hash(
        req.body.newPassword,
        Number(ENV.SALT_ROUNDS)
      );

      // generate token
      const token = generateAuthToken({
        id: user.id,
        password: userPassword,
      });
      await prisma.user.update({
        where: { id: user.id },
        data: {
          pwdResetToken: null,
          currentSessionToken: token,
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Password reset successfully!",
        data: {
          user: excludeTypesInModel(user, [
            "password",
            "pwdResetToken",
            "currentSessionToken",
          ]),
          token,
        },
      });
    } catch (error: any) {
      next(error);
    }
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });
      if (!user) {
        return res.status(400).json({
          status: "error",
          message: `A user with the email ${req.body.email} doesn't exist`,
          data: {},
        });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          pwdResetToken: null,
          currentSessionToken: null,
        },
      });

      return res.status(200).json({
        status: "success",
        message: "User logged out successfully!",
        data: {
          user: excludeTypesInModel(user, [
            "password",
            "pwdResetToken",
            "currentSessionToken",
          ]),
        },
      });
    } catch (error: any) {
      next(error);
    }
  },
};

export default authController;
