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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemas = exports.updatePermission = exports.handleGetApis = void 0;
const connection_1 = require("@/config/connection");
const entities_1 = require("@/entities");
const gateway_1 = require("@/helpers/gateway");
const mongoose_1 = require("@/helpers/mongoose");
const permission_1 = require("@/helpers/permission");
const mongoose_orm_1 = require("mongoose-orm");
const handleGetApis = (req, res, next) => {
    res.json(gateway_1.apis);
};
exports.handleGetApis = handleGetApis;
const updatePermission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = req.body.permissions;
    const result = yield Promise.all(permissions.map((permission) => {
        if (!mongoose_orm_1.getObjectId(permission)) {
            return entities_1.permissionRepository.create({ data: permission });
        }
        else {
            return entities_1.permissionRepository.updateOne({
                query: {
                    id: mongoose_orm_1.getObjectId(permission),
                },
                data: _.omit(permission, ["id"]),
            });
        }
    }));
    res.json(result);
});
exports.updatePermission = updatePermission;
const getSchemas = (req, res, next) => {
    try {
        const schemas = {};
        const repositories = mongoose_orm_1.getRepositories(connection_1.connection);
        Object.keys(repositories).forEach((name) => {
            const repository = repositories[name];
            const ops = _.get(repository.schema, mongoose_orm_1.KEYS.SCHEMA_OPTIONS);
            const user = req.meta.user;
            const checkPermission = new permission_1.CheckPermission(req.meta.permissions, user);
            if (checkPermission.hasEntityPermission({ key: name })) {
                const schema = mongoose_1.getEntityForm(repository);
                const populates = [];
                Object.keys(schema).forEach((key) => {
                    var _a;
                    if (schema[key].type === "ObjectId") {
                        populates.push(key);
                        if (!((_a = schema[key].props) === null || _a === void 0 ? void 0 : _a.labelKey)) {
                            if (ops.owner && ["createdBy", "updatedBy"].includes(key)) {
                                _.set(schema[key], "props.labelKey", "profile.name");
                            }
                            else
                                _.set(schema[key], "props.labelKey", "name");
                        }
                    }
                });
                schemas[name] = {
                    key: name,
                    name: ops.name || name,
                    description: ops.description,
                    populates: _.uniq(populates.concat(...(ops.populates || []))),
                    endpoint: "/entity/" + _.kebabCase(name),
                    schema,
                };
            }
        });
        res.json(schemas);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
};
exports.getSchemas = getSchemas;
//# sourceMappingURL=admin.controller.js.map