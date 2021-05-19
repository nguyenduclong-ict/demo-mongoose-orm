import {
  NextFunction,
  request,
  Request,
  RequestHandler,
  Response,
} from "express";
import { getValidator, parseClassParams } from "./validator";
import Validator, { ErrorList } from "async-validator";
import { E } from "@/config";
import "reflect-metadata";

export const initRequestMeta: RequestHandler = (req, res, next) => {
  req.meta = req.meta || {};
  next();
};

export function Params(paramsClass: any) {
  return function (constructor: Function) {
    Reflect.defineMetadata("paramsClass", paramsClass, constructor);
  };
}

export const handler = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const origin = descriptor.value;
  let validator: Validator;

  descriptor.value = async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const self = target;

    const paramsClass = Reflect.getOwnMetadata(
      "paramsClass",
      target.constructor
    );

    if (paramsClass) {
      validator = validator || getValidator(paramsClass);
    }

    self.params = { ...req.body, ...request.params, ...req.query };

    parseClassParams(paramsClass, self.params);

    if (self.parseParams) {
      await self.parseParams();
    }

    try {
      await validator.validate(self.params);
      return origin.call(self, req, res, next);
    } catch (error: any) {
      const errors: ErrorList = error.errors;
      return next(E.UnprocessableEntity(errors[0].message, errors));
    }
  };
  return descriptor;
};

export class Controller<Params = any> {
  params?: Params;

  parseParams() {}

  constructor() {}

  handler(req: Request, res: Response, next: NextFunction): any {}
}
