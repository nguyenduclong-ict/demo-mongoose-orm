import { createError, RequestError } from "@/helpers/error";

export const E = {
  NotFound: (message = "Not Found", data?: any) =>
    createError(404, message, data),
  UnprocessableEntity: (message = "Unprocessable Entity", data?: any) =>
    createError(422, message, data),
  Forbidden: (message = "Forbidden", data?: any) =>
    createError(403, message, data),
  Unauthorized: (message = "Unauthorized", data?: any) =>
    createError(401, message, data),
  BadRequest: (message = "Bad Request", data?: any) =>
    createError(400, message, data),
  InternalServerError: (message = "Internal Server Error", data?: any) =>
    createError(500, message, data),
  Error: (code: number, message?: string, data?: any) =>
    createError(code, message, data),
};
