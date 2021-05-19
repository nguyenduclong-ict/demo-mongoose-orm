import { Controller, handler, Params } from "@/helpers/api";
import { IsNumber, IsOptional, IsString, Parse } from "@/helpers/validator";
import { NextFunction, Request, Response } from "express";

class DemoTestParams {
  @IsNumber()
  @Parse("number")
  id: number;

  @IsString()
  name: number;
}

@Params(DemoTestParams)
export class DemoTestController extends Controller {
  @handler
  handler(req: Request, res: Response, next: NextFunction) {
    res.json("oke");
  }
}
