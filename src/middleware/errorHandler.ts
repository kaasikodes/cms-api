import { NextFunction, Request, Response } from "express";
import { ENV } from "../config/enviroment";

export default (
  error: Error & { statusCode: number; errors: string[] },
  _: Request,
  response: Response,
  next: NextFunction
) => {
  const isProduction = ENV.NODE_ENV === "production";
  let errorMessage = {};

  if (response.headersSent) {
    return next(error);
  }

  if (!isProduction) {
    errorMessage = error;
  }

  return response.status(error?.statusCode || 500).json({
    status: "error",
    error: {
      message: error.message,
      ...(error?.errors && { errors: error?.errors }),
      ...(!isProduction && { trace: errorMessage }),
    },
  });
};
