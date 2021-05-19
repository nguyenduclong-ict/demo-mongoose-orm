"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E = void 0;
const error_1 = require("@/helpers/error");
exports.E = {
    NotFound: (message = "Not Found", data) => error_1.createError(404, message, data),
    UnprocessableEntity: (message = "Unprocessable Entity", data) => error_1.createError(422, message, data),
    Forbidden: (message = "Forbidden", data) => error_1.createError(403, message, data),
    Unauthorized: (message = "Unauthorized", data) => error_1.createError(401, message, data),
    BadRequest: (message = "Bad Request", data) => error_1.createError(400, message, data),
    InternalServerError: (message = "Internal Server Error", data) => error_1.createError(500, message, data),
    Error: (code, message, data) => error_1.createError(code, message, data),
};
//# sourceMappingURL=error.js.map