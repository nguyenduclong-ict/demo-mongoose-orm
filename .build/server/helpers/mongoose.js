"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntityForm = exports.IEntity = exports.SchemaPopulates = exports.Slug = void 0;
const lodash_1 = __importDefault(require("lodash"));
const mongoose_orm_1 = require("mongoose-orm");
const slugify_1 = __importDefault(require("slugify"));
const Slug = (fields, randomId = false, check = null) => {
    return function () {
        if (check && !check(this))
            return;
        if (typeof fields === "string")
            fields = [fields];
        let slug = fields
            .map((field) => slugify_1.default(lodash_1.default.get(this, field), { lower: true }))
            .join("-");
        if (randomId) {
            slug += "-" + Math.random().toString(36).slice(2, 8);
        }
        return slug;
    };
};
exports.Slug = Slug;
function SchemaPopulates(schema, populates) {
    const options = lodash_1.default.get(schema, mongoose_orm_1.KEYS.SCHEMA_OPTIONS, {});
    for (const key in populates) {
        if (Object.prototype.hasOwnProperty.call(populates, key)) {
            // @ts-ignore
            schema.virtual(key, populates[key]);
            options.populates = options.populates || [];
            options.populates.push(key);
        }
    }
}
exports.SchemaPopulates = SchemaPopulates;
class IEntity {
}
exports.IEntity = IEntity;
function getEntityForm(repository) {
    const options = lodash_1.default.get(repository.schema, mongoose_orm_1.KEYS.SCHEMA_PATHS);
    const result = {};
    const getType = (t) => (t === null || t === void 0 ? void 0 : t.schemaName) || (t === null || t === void 0 ? void 0 : t.name);
    Object.keys(options).forEach((key) => {
        const field = {};
        let origin;
        const option = options[key];
        if (Array.isArray(option)) {
            field.type === "Array";
            field.arrayType = getType(option[0].type);
            field.ref = option[0].ref;
            origin = option[0];
        }
        else if (Array.isArray(option.type)) {
            field.type = "Array";
            field.ref = option.type[0].ref;
            field.arrayType = getType(option.type[0].type);
            origin = option;
        }
        else {
            field.type = getType(option.type);
            field.ref = option.ref;
            origin = option;
        }
        field.type = field.type || "String";
        Object.assign(field, lodash_1.default.pick(option, "name", "description", "default", "ui"));
        Object.assign(field, lodash_1.default.pick(origin, "required", "max", "min", "maxlength", "minlength", "enum", "default", "validator", "unique", "props", "ui"));
        result[key] = field;
    });
    return result;
}
exports.getEntityForm = getEntityForm;
// Register global hooks
mongoose_orm_1.Repository.registerHook("before", ["create"], function (ctx) {
    var _a, _b;
    const options = this.schema[mongoose_orm_1.KEYS.SCHEMA_OPTIONS];
    if (options.owner)
        ctx.data.createdBy = (_b = (_a = ctx.meta) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
});
mongoose_orm_1.Repository.registerHook("before", ["create"], function (ctx) {
    var _a, _b;
    const options = this.schema[mongoose_orm_1.KEYS.SCHEMA_OPTIONS];
    if (options.owner)
        ctx.data.createdBy = (_b = (_a = ctx.meta) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
});
mongoose_orm_1.Repository.registerHook("before", ["createMany"], function (ctx) {
    const options = this.schema[mongoose_orm_1.KEYS.SCHEMA_OPTIONS];
    if (options.owner)
        ctx.data.forEach((entity) => {
            var _a, _b;
            entity.createdBy = (_b = (_a = ctx.meta) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
        });
});
mongoose_orm_1.Repository.registerHook("before", ["update", "updateOne"], function (ctx) {
    var _a, _b;
    const options = this.schema[mongoose_orm_1.KEYS.SCHEMA_OPTIONS];
    if (options.owner)
        ctx.data.updatedBy = (_b = (_a = ctx.meta) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
});
//# sourceMappingURL=mongoose.js.map