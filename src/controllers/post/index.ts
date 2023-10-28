import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as fs from "fs";
import { ENV } from "../../config/enviroment";
import { excludeTypesInModel } from "../../helpers";

const publicKey = fs.readFileSync("public-key.pem", "utf8");
const prisma = new PrismaClient();

const postController = {
  getPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!post) {
        return res.status(400).json({
          status: "error",
          message: `No post exists with id provided!`,
          data: {},
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Post retrieved successfully!",
        data: {
          post,
        },
      });
    } catch (error: any) {
      next(error);
    }
  },
  deletePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;
      let token: string;

      [, token] = (authorization as string).split(" ");

      const post = await prisma.post.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!post) {
        return res.status(400).json({
          status: "error",
          message: `No post exists with id provided!`,
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
            if (((decoded as any)?.id as unknown as string) !== post.authorId) {
              return res.status(400).json({
                status: "error",
                message: `You can only delete your post!`,
                data: {},
              });
            } else {
              const updatedPost = await prisma.post.delete({
                where: {
                  id: req.params.id,
                },
              });
              return res.status(200).json({
                status: "success",
                message: "Post deleted successfully!",
                data: {
                  post: updatedPost,
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
  createPost: async (req: Request, res: Response, next: NextFunction) => {
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
            console.log("Error verifying token:", err);
            next(err);
          }
          if (decoded) {
            const authorId = (decoded as any)?.id as unknown as string;

            const createdPost = await prisma.post.create({
              data: {
                content: req.body.content,
                title: req.body.title,
                author: {
                  connect: {
                    id: authorId,
                  },
                },
              },
            });
            return res.status(200).json({
              status: "success",
              message: "Post created successfully!",
              data: {
                post: createdPost,
              },
            });
          }
        }
      );
    } catch (error: any) {
      next(error);
    }
  },
  updatePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;
      let token: string;

      [, token] = (authorization as string).split(" ");

      const post = await prisma.post.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!post) {
        return res.status(400).json({
          status: "error",
          message: `No post exists with id provided!`,
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
            if (((decoded as any)?.id as unknown as string) !== post.authorId) {
              return res.status(400).json({
                status: "error",
                message: `You can only edit your post!`,
                data: {},
              });
            } else {
              const updatedPost = await prisma.post.update({
                where: {
                  id: req.params.id,
                },
                data: {
                  ...req.body,
                },
              });
              return res.status(200).json({
                status: "success",
                message: "Post updated successfully!",
                data: {
                  post: updatedPost,
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
  getAllPosts: async (req: Request, res: Response, next: NextFunction) => {
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
        message: "Posts retrieved successfully!",
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

export default postController;
