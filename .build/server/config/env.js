"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_PATH = void 0;
const path_1 = __importDefault(require("path"));
exports.UPLOAD_PATH = process.env.UPLOAD_PATH ||
    path_1.default.resolve(process.cwd(), process.env.STATIC_PATH, "upload");
//# sourceMappingURL=env.js.map