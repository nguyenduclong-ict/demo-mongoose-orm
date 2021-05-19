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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRepository = exports.PermissionSchema = exports.Permission = void 0;
const connection_1 = require("@/config/connection");
const mongoose_1 = require("@/helpers/mongoose");
const mongoose_2 = require("mongoose");
const mongoose_orm_1 = require("mongoose-orm");
const Role_1 = require("./Role");
const User_1 = require("./User");
let Permission = class Permission extends mongoose_1.IEntity {
};
__decorate([
    mongoose_orm_1.Field({
        type: mongoose_2.SchemaTypes.ObjectId,
        ref: "Role",
    }),
    __metadata("design:type", Role_1.Role)
], Permission.prototype, "role", void 0);
__decorate([
    mongoose_orm_1.Field({
        type: mongoose_2.SchemaTypes.ObjectId,
        ref: "User",
    }),
    __metadata("design:type", User_1.User)
], Permission.prototype, "user", void 0);
__decorate([
    mongoose_orm_1.Field({
        type: String,
        enum: ["entity", "api", "admin-page"],
    }),
    __metadata("design:type", String)
], Permission.prototype, "entityType", void 0);
__decorate([
    mongoose_orm_1.Field({
        type: String,
        enum: ["create", "read", "update", "delete", "all"],
        default: "all",
    }),
    __metadata("design:type", String)
], Permission.prototype, "action", void 0);
__decorate([
    mongoose_orm_1.Field({
        type: String,
    }),
    __metadata("design:type", String)
], Permission.prototype, "endpoint", void 0);
__decorate([
    mongoose_orm_1.Field({
        type: String,
    }),
    __metadata("design:type", String)
], Permission.prototype, "pageName", void 0);
__decorate([
    mongoose_orm_1.Field({
        type: String,
        enum: ["GET", "POST", "PUT", "DELETE"],
    }),
    __metadata("design:type", String)
], Permission.prototype, "method", void 0);
__decorate([
    mongoose_orm_1.Field({
        type: String,
    }),
    __metadata("design:type", String)
], Permission.prototype, "entity", void 0);
__decorate([
    mongoose_orm_1.Field({
        type: Boolean,
        default: true,
    }),
    __metadata("design:type", Boolean)
], Permission.prototype, "status", void 0);
__decorate([
    mongoose_orm_1.Field({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Permission.prototype, "isAuthenticated", void 0);
__decorate([
    mongoose_orm_1.Field({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Permission.prototype, "isAnonymous", void 0);
__decorate([
    mongoose_orm_1.Field({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Permission.prototype, "onlySelf", void 0);
Permission = __decorate([
    mongoose_orm_1.Entity({
        timestamps: true,
        indexes: [
            {
                fields: {
                    entityType: 1,
                    isAnonymous: 1,
                    isAuthenticated: 1,
                    role: 1,
                    user: 1,
                },
            },
        ],
    })
], Permission);
exports.Permission = Permission;
exports.PermissionSchema = mongoose_orm_1.createSchema(Permission);
let PermissionRepository = class PermissionRepository extends mongoose_orm_1.Repository {
};
PermissionRepository = __decorate([
    mongoose_orm_1.Inject({ connection: connection_1.connection, schema: exports.PermissionSchema })
], PermissionRepository);
exports.PermissionRepository = PermissionRepository;
//# sourceMappingURL=Permission.js.map