"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.MediaRepository = exports.MediaSchema = exports.Media = exports.MediaSource = void 0;
const connection_1 = require("@/config/connection");
const mongoose_1 = require("mongoose");
const mongoose_orm_1 = require("mongoose-orm");
const url_join_1 = __importDefault(require("url-join"));
const User_1 = require("./User");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("@/config/env");
var MediaSource;
(function (MediaSource) {
    MediaSource["LOCAL"] = "local";
    MediaSource["EXTERNAL"] = "external";
})(MediaSource = exports.MediaSource || (exports.MediaSource = {}));
let Media = class Media {
};
__decorate([
    mongoose_orm_1.Field({ type: String }),
    __metadata("design:type", String)
], Media.prototype, "name", void 0);
__decorate([
    mongoose_orm_1.Field({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], Media.prototype, "isPublic", void 0);
__decorate([
    mongoose_orm_1.Field({ type: String }),
    __metadata("design:type", String)
], Media.prototype, "src", void 0);
__decorate([
    mongoose_orm_1.Field({ type: String }),
    __metadata("design:type", String)
], Media.prototype, "path", void 0);
__decorate([
    mongoose_orm_1.Field({ type: mongoose_1.SchemaTypes.String, default: "" }),
    __metadata("design:type", String)
], Media.prototype, "alt", void 0);
__decorate([
    mongoose_orm_1.Field({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Media.prototype, "size", void 0);
__decorate([
    mongoose_orm_1.Field({ type: Array, of: String, default: [] }),
    __metadata("design:type", Array)
], Media.prototype, "thumbnails", void 0);
__decorate([
    mongoose_orm_1.Field({ type: mongoose_1.SchemaTypes.String }),
    __metadata("design:type", String)
], Media.prototype, "fileType", void 0);
__decorate([
    mongoose_orm_1.Field({ type: String, enum: Object.values(MediaSource) }),
    __metadata("design:type", String)
], Media.prototype, "type", void 0);
__decorate([
    mongoose_orm_1.Field({ type: mongoose_1.SchemaTypes.ObjectId, ref: User_1.User.name }),
    __metadata("design:type", User_1.User)
], Media.prototype, "createdBy", void 0);
__decorate([
    mongoose_orm_1.Field({ type: mongoose_1.SchemaTypes.ObjectId, ref: User_1.User.name }),
    __metadata("design:type", User_1.User)
], Media.prototype, "updatedBy", void 0);
Media = __decorate([
    mongoose_orm_1.Entity({
        indexes: [{ fields: { name: "text" } }],
        timestamps: true,
        owner: true,
    })
], Media);
exports.Media = Media;
exports.MediaSchema = mongoose_orm_1.createSchema(Media);
exports.MediaSchema.virtual("url").get(function () {
    if (this.type === MediaSource.LOCAL)
        return url_join_1.default(process.env.SERVER_URL, "/api/file", this.name);
    if (this.type === MediaSource.EXTERNAL)
        return this.src;
});
let MediaRepository = class MediaRepository extends mongoose_orm_1.Repository {
    beforeDelete(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.find({ query: ctx.query });
            console.log(deleted);
            ctx.meta.deleted = deleted;
        });
    }
    afterDelete(ctx, result) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = ctx.meta.deleted;
            yield Promise.all(deleted.map((media) => {
                const filePaths = [media.path, ...(media.thumbnails || [])];
                return Promise.all(filePaths.map((filePath) => fs_1.default.promises
                    .unlink(path_1.default.join(env_1.UPLOAD_PATH, filePath))
                    .catch((e) => null)));
            }));
            return result;
        });
    }
};
__decorate([
    mongoose_orm_1.Hook("before", ["delete"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MediaRepository.prototype, "beforeDelete", null);
__decorate([
    mongoose_orm_1.Hook("after", ["delete"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MediaRepository.prototype, "afterDelete", null);
MediaRepository = __decorate([
    mongoose_orm_1.Inject({ connection: connection_1.connection, schema: exports.MediaSchema })
], MediaRepository);
exports.MediaRepository = MediaRepository;
//# sourceMappingURL=Media.js.map