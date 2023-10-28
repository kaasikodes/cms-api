import {
  ValidationChain,
  matchedData,
  validationResult,
} from "express-validator";
import { ApplicationError } from "../error/ApplicationError";
import { NextFunction, Request, Response } from "express";

export default (schemas: ValidationChain[], status = 400) => {
  const validationCheck = async (
    req: Request,
    _: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);
    let request = { ...req, ...matchedData(req) };

    if (!errors.isEmpty()) {
      const mappedErrors = Object.entries(errors.mapped()).reduce(
        (accumulator: any, [key, value]) => {
          accumulator[key] = value.msg;
          return accumulator;
        },
        {}
      );

      const validationErrors = new ApplicationError(
        status,
        "validation error",
        mappedErrors
      );

      return next(validationErrors);
    }

    return next();
  };

  return [...schemas, validationCheck];
};
