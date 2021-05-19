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
exports.ConfigRepository = exports.ConfigSchema = exports.Config = void 0;
const connection_1 = require("@/config/connection");
const mongoose_1 = require("@/helpers/mongoose");
const mongoose_2 = require("mongoose");
const mongoose_orm_1 = require("mongoose-orm");
let Config = class Config extends mongoose_1.IEntity {
};
__decorate([
    mongoose_orm_1.Field(),
    __metadata("design:type", String)
], Config.prototype, "key", void 0);
__decorate([
    mongoose_orm_1.Field({
        type: mongoose_2.SchemaTypes.Mixed,
    }),
    __metadata("design:type", Object)
], Config.prototype, "value", void 0);
Config = __decorate([
    mongoose_orm_1.Entity({})
], Config);
exports.Config = Config;
exports.ConfigSchema = mongoose_orm_1.createSchema(Config);
let ConfigRepository = class ConfigRepository extends mongoose_orm_1.Repository {
    bf(ctx) {
        console.log(ctx);
    }
};
__decorate([
    mongoose_orm_1.Hook("before", ["find"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConfigRepository.prototype, "bf", null);
ConfigRepository = __decorate([
    mongoose_orm_1.Inject({ connection: connection_1.connection, schema: exports.ConfigSchema })
], ConfigRepository);
exports.ConfigRepository = ConfigRepository;
//# sourceMappingURL=Config.js.map