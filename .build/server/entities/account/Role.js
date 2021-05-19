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
exports.RoleRepository = exports.RoleSchema = exports.Role = void 0;
const connection_1 = require("@/config/connection");
const mongoose_orm_1 = require("mongoose-orm");
const mongoose_1 = require("@/helpers/mongoose");
let Role = class Role extends mongoose_1.IEntity {
};
__decorate([
    mongoose_orm_1.Field({ type: String, required: true }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    mongoose_orm_1.Field({
        type: String,
        required: true,
        unique: true,
        validate: (v) => v !== "authenticated" && v !== "anonymous",
    }),
    __metadata("design:type", String)
], Role.prototype, "code", void 0);
Role = __decorate([
    mongoose_orm_1.Entity({})
], Role);
exports.Role = Role;
exports.RoleSchema = mongoose_orm_1.createSchema(Role);
let RoleRepository = class RoleRepository extends mongoose_orm_1.Repository {
};
RoleRepository = __decorate([
    mongoose_orm_1.Inject({ connection: connection_1.connection, schema: exports.RoleSchema })
], RoleRepository);
exports.RoleRepository = RoleRepository;
//# sourceMappingURL=Role.js.map