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
exports.handleGetFile = void 0;
const config_1 = require("@/config");
const env_1 = require("@/config/env");
const roles_1 = require("@/config/roles");
const entities_1 = require("@/entities");
const utils_1 = require("@/helpers/utils");
const mongoose_orm_1 = require("mongoose-orm");
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const handleGetFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const media = yield entities_1.mediaRepository.findOne({
        query: {
            name: req.params.fileName,
        },
    });
    if (!media) {
        throw config_1.E.NotFound();
    }
    const user = req.meta.user;
    if (media.isPublic === false) {
        if (!user)
            throw config_1.E.Forbidden();
        if (!user.roles.find((role) => role.code === roles_1.ROLES.ADMIN || role.code === roles_1.ROLES.STAFF)) {
            throw config_1.E.Forbidden();
        }
        if (!utils_1.compareObjectId(user.id, media.createdBy))
            throw config_1.E.Forbidden();
    }
    const filePath = path_1.default.join(env_1.UPLOAD_PATH, media.path);
    const size = req.query.size;
    if (size) {
        let [width, height] = size.split("x");
        width = +width || undefined;
        height = +height || undefined;
        const filePathResized = utils_1.renameFile(filePath, (n) => n + `_${width}x${height}`);
        try {
            const exists = yield utils_1.checkFileExists(filePathResized);
            if (!exists) {
                yield sharp_1.default(filePath).resize(width, height).toFile(filePathResized);
                yield entities_1.mediaRepository.updateOne({
                    query: {
                        id: mongoose_orm_1.getObjectId(media),
                    },
                    data: {
                        $push: {
                            thumbnails: filePathResized.replace(RegExp(`^${env_1.UPLOAD_PATH}`), ""),
                        },
                    },
                });
                return res.sendFile(filePathResized);
            }
            else {
                return res.sendFile(filePathResized);
            }
        }
        catch (error) {
            console.error("Resize file error", error);
        }
    }
    else {
        return res.sendFile(filePath);
    }
});
exports.handleGetFile = handleGetFile;
//# sourceMappingURL=file.controller.js.map