"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingleFile = exports.upload = void 0;
const env_1 = require("@/config/env");
const account_1 = require("@/entities/account");
const Media_1 = require("@/entities/account/Media");
const mongoose_1 = require("mongoose");
const multer_1 = __importDefault(require("multer"));
const slugify_1 = __importDefault(require("slugify"));
exports.upload = multer_1.default({
    storage: multer_1.default.diskStorage({
        destination: env_1.UPLOAD_PATH,
        filename: (req, file, callback) => {
            callback(null, mongoose_1.Types.ObjectId().toHexString() +
                "-" +
                slugify_1.default(file.originalname, { lower: true }));
        },
    }),
});
const uploadSingleFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const media = yield account_1.mediaRepository.create({
            data: {
                name: req.file.filename,
                path: req.file.path.replace(env_1.UPLOAD_PATH, ""),
                type: Media_1.MediaSource.LOCAL,
                isPublic: (_a = req.body.isPublic) !== null && _a !== void 0 ? _a : true,
                size: req.file.size,
                fileType: req.file.mimetype,
            },
            meta: req.meta,
            populates: ["createdBy", "updatedBy"],
        });
        res.json(media);
    }
    catch (error) {
        console.error("uploadSingleFile", error);
        next(error);
    }
});
exports.uploadSingleFile = uploadSingleFile;
//# sourceMappingURL=media.controller.js.map