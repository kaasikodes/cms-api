import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as fs from "fs";
import { ENV } from "../../config/enviroment";

const publicKey = fs.readFileSync("public-key.pem", "utf8");
const prisma = new PrismaClient();

const categoryController = {
  getCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await prisma.category.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!category) {
        return res.status(400).json({
          status: "error",
          message: `No category exists with id provided!`,
          data: {},
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Category retrieved successfully!",
        data: {
          category,
        },
      });
    } catch (error: any) {
      next(error);
    }
  },
  deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;
      let token: string;

      [, token] = (authorization as string).split(" ");

      const category = await prisma.category.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!category) {
        return res.status(400).json({
          status: "error",
          message: `No category exists with id provided!`,
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
            next(err);
          }
          if (decoded) {
            if (
              ((decoded as any)?.id as unknown as string) !== category.authorId
            ) {
              return res.status(400).json({
                status: "error",
                message: `You can only delete your category!`,
                data: {},
              });
            } else {
              const updatedCategory = await prisma.category.delete({
                where: {
                  id: req.params.id,
                },
              });
              return res.status(200).json({
                status: "success",
                message: "Category deleted successfully!",
                data: {
                  category: updatedCategory,
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
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;
      let token: string;

      [, token] = (authorization as string).split(" ");

      jwt.verify(
        token,
        publicKey,
        {
          algorithms: ["RS256"],
          issuer: ENV.APP_DOMAIN,
        },
        async (err, decoded) => {
          if (err) {
            next(err);
          }
          if (decoded) {
            const authorId = (decoded as any)?.id as unknown as string;

            const createdCategory = await prisma.category.create({
              data: {
                name: req.body.name,
                author: {
                  connect: {
                    id: authorId,
                  },
                },
              },
            });
            return res.status(200).json({
              status: "success",
              message: "Category created successfully!",
              data: {
                category: createdCategory,
              },
            });
          }
        }
      );
    } catch (error: any) {
      next(error);
    }
  },
  updateCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;
      let token: string;

      [, token] = (authorization as string).split(" ");

      const category = await prisma.category.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!category) {
        return res.status(400).json({
          status: "error",
          message: `No category exists with id provided!`,
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
            next(err);
          }
          if (decoded) {
            if (
              ((decoded as any)?.id as unknown as string) !== category.authorId
            ) {
              return res.status(400).json({
                status: "error",
                message: `You can only edit your category!`,
                data: {},
              });
            } else {
              const updatedData = await prisma.category.update({
                where: {
                  id: req.params.id,
                },
                data: {
                  ...req.body,
                },
              });
              return res.status(200).json({
                status: "success",
                message: "Category updated successfully!",
                data: {
                  category: updatedData,
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
  getAllCategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const offset = req.query.offset ? Number(req.query.offset) : undefined;

      //   account for pagination
      const total = await prisma.post.count();
      const posts = await prisma.post.findMany({
        take: limit,
        skip: offset,
      });
      return res.status(200).json({
        status: "success",
        message: "Categories retrieved successfully!",
        data: {
          result: posts,
          total,
        },
      });
    } catch (error: any) {
      next(error);
    }
  },
};

export default categoryController;
