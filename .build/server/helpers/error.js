"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.HandleRequestError = exports.ERROR_CODES = exports.RequestError = void 0;
class RequestError extends Error {
    constructor(statusCode, message, { data, code } = {}) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.code = code;
    }
}
exports.RequestError = RequestError;
exports.ERROR_CODES = {
    VALIDATOR_ERROR: "VALIDATOR_ERROR",
};
const HandleRequestError = (error, req, res, next) => {
    if (error) {
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message, error });
    }
};
exports.HandleRequestError = HandleRequestError;
const createError = (statusCode, message, data, code) => {
    return new RequestError(statusCode, message, { data, code });
};
exports.createError = createError;
//# sourceMappingURL=error.js.map