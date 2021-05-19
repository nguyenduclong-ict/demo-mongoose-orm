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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = exports.UserSchema = exports.User = void 0;
const connection_1 = require("@/config/connection");
const mongoose_1 = require("@/helpers/mongoose");
const mongoose_2 = require("mongoose");
const mongoose_orm_1 = require("mongoose-orm");
const _1 = require(".");
const Role_1 = require("./Role");
let User = class User extends mongoose_1.IEntity {
};
__decorate([
    mongoose_orm_1.Field({ type: String, unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    mongoose_orm_1.Field(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    mongoose_orm_1.Field(),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    mongoose_orm_1.Field({ type: String, required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    mongoose_orm_1.Field({ type: String, unique: true }),
    __metadata("design:type", String)
], User.prototype, "facebookId", void 0);
__decorate([
    mongoose_orm_1.Field({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "blocked", void 0);
__decorate([
    mongoose_orm_1.Field({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isAdmin", void 0);
__decorate([
    mongoose_orm_1.Field({ type: mongoose_2.SchemaTypes.Mixed, default: {} }),
    __metadata("design:type", Object)
], User.prototype, "profile", void 0);
__decorate([
    mongoose_orm_1.Field({
        type: [{ type: mongoose_2.SchemaTypes.ObjectId, ref: Role_1.Role.name }],
        default: [],
    }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
User = __decorate([
    mongoose_orm_1.Entity({
        indexes: [
            { fields: { username: 1, phone: 1, email: 1 }, options: { unique: true } },
        ],
    })
], User);
exports.User = User;
exports.UserSchema = mongoose_orm_1.createSchema(User);
let UserRepository = class UserRepository extends mongoose_orm_1.Repository {
    fetchUser(id) {
        return this.findOne({
            query: {
                _id: id,
            },
            populates: ["roles"],
        });
    }
    getUserPermissions(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = id
                ? yield this.findOne({
                    query: { id: mongoose_orm_1.getObjectId(id) },
                    populates: ["roles"],
                })
                : null;
            const query = {
                $or: [{ isAnonymous: true }],
            };
            if (user) {
                query.$or = query.$or || [];
                query.$or.push({ user: mongoose_orm_1.getObjectId(id) }, {
                    role: {
                        $in: user.roles.map((role) => mongoose_orm_1.getObjectId(role)),
                    },
                }, { isAuthenticated: true });
            }
            return _1.permissionRepository.find({
                query,
                limit: Number.MAX_SAFE_INTEGER,
            });
        });
    }
};
UserRepository = __decorate([
    mongoose_orm_1.Inject({ connection: connection_1.connection, schema: exports.UserSchema })
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=User.js.map