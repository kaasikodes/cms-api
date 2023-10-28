import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as fs from "fs";
import { ENV } from "../../config/enviroment";
import { excludeTypesInModel } from "../../helpers";

const publicKey = fs.readFileSync("public-key.pem", "utf8");
const prisma = new PrismaClient();

const userController = {
  getUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!user) {
        return res.status(400).json({
          status: "error",
          message: `No user exists with id provided!`,
          data: {},
        });
      }
      return res.status(200).json({
        status: "success",
        message: "User retrieved successfully!",
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
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;
      let token: string;

      [, token] = (authorization as string).split(" ");

      const user = await prisma.user.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!user) {
        return res.status(400).json({
          status: "error",
          message: `No user exists with id provided!`,
          data: {},
        });
      }
      jwt.verify(
        token,
        publicKey,
        {
          algorithms: ["RS256"],
          issuer: ENV.APP_DOMAIN,
        },
        async (err, decoded) => {
          if (err) {
            console.log("Error verifying token:", err);
            next(err);
          }
          if (decoded) {
            console.log(decoded);
            const user = await prisma.user.findUnique({
              where: { id: (decoded as any)?.id as unknown as string },
            });

            if (((decoded as any)?.id as unknown as string) !== req.params.id) {
              return res.status(400).json({
                status: "error",
                message: `You can only edit your profile!`,
                data: {},
              });
            } else {
              const updatedUser = await prisma.user.update({
                where: {
                  id: req.params.id,
                },
                data: {
                  ...req.body,
                },
              });
              return res.status(200).json({
                status: "success",
                message: "User updated successfully!",
                data: {
                  user: excludeTypesInModel(updatedUser, [
                    "password",
                    "pwdResetToken",
                    "currentSessionToken",
                  ]),
                },
              });
            }
          }
        }
      );
    } catch (error: any) {
      next(error);
    }
  },
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;
      let token: string;

      [, token] = (authorization as string).split(" ");

      const user = await prisma.user.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          categories: true,
          posts: true,
        },
      });
      if (!user) {
        return res.status(400).json({
          status: "error",
          message: `No user exists with id provided!`,
          data: {},
        });
      }
      if (user.categories.length > 0 || user.posts.length > 0) {
        return res.status(400).json({
          status: "error",
          message: `User has posts or categories, so can't be deleted, without admin permission!`,
          data: {},
        });
      }
      jwt.verify(
        token,
        publicKey,
        {
          algorithms: ["RS256"],
          issuer: ENV.APP_DOMAIN,
        },
        async (err, decoded) => {
          if (err) {
            console.log("Error verifying token:", err);
            next(err);
          }
          if (decoded) {
            console.log(decoded);
            const user = await prisma.user.findUnique({
              where: { id: (decoded as any)?.id as unknown as string },
            });

            if (((decoded as any)?.id as unknown as string) !== req.params.id) {
              return res.status(400).json({
                status: "error",
                message: `You can only delete your profile!`,
                data: {},
              });
            } else {
              const deletedUser = await prisma.user.delete({
                where: {
                  id: req.params.id,
                },
              });
              return res.status(200).json({
                status: "success",
                message: "User deleted successfully!",
                data: {
                  user: excludeTypesInModel(deletedUser, [
                    "password",
                    "pwdResetToken",
                    "currentSessionToken",
                  ]),
                },
              });
            }
          }
        }
      );
    } catch (error: any) {
      next(error);
    }
  },
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const offset = req.query.offset ? Number(req.query.offset) : undefined;

      //   account for pagination
      const total = await prisma.user.count();
      const users = await prisma.user.findMany({
        take: limit,
        skip: offset,
      });
      return res.status(200).json({
        status: "success",
        message: "Users retrieved successfully!",
        data: {
          result: users.map((user) =>
            excludeTypesInModel(user, [
              "password",
              "pwdResetToken",
              "currentSessionToken",
            ])
          ),
          total,
        },
      });
    } catch (error: any) {
      next(error);
    }
  },
};

export default userController;
