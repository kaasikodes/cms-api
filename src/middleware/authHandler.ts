import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as fs from "fs";
import { ENV } from "../config/enviroment";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const publicKey = fs.readFileSync("public-key.pem", "utf8");

const authHandler = {
  verifyAuthToken: async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    try {
      if (!authorization) {
        return res.status(400).json({
          status: "error",
          message: `No token provided`,
          data: {},
        });
      }
      let token: string;

      [, token] = authorization.split(" ");

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

            if (
              !user ||
              !user?.currentSessionToken ||
              user?.currentSessionToken !== token
            ) {
              return res.status(400).json({
                status: "error",
                message: `No user with token exists!`,
                data: {},
              });
            }
          }
        }
      );
      return next();
    } catch (error: any) {
      next(error);
    }
  },
  verifyResetPasswordToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(400).json({
          status: "error",
          message: `No token provided`,
          data: {},
        });
      }
      let token: string;

      [, token] = authorization.split(" ");

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

            if (
              !user ||
              !user?.pwdResetToken ||
              user?.pwdResetToken !== token
            ) {
              return res.status(400).json({
                status: "error",
                message: `No user with token exists!`,
                data: {},
              });
            }
          }
        }
      );
      return next();
    } catch (error: any) {
      next(error);
    }
  },
};
export default authHandler;
