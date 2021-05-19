"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRequestMeta = void 0;
const initRequestMeta = (req, res, next) => {
    req.meta = req.meta || {};
    next();
};
exports.initRequestMeta = initRequestMeta;
//# sourceMappingURL=api.js.map