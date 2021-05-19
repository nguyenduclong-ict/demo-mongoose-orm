"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("@/config/connection");
const gateway_1 = require("@/helpers/gateway");
const auth_1 = require("@/middlewares/auth");
const mongoose_orm_1 = require("mongoose-orm");
const entity_controller_1 = require("./entity.controller");
exports.default = gateway_1.createRouterApi(Object.keys(mongoose_orm_1.getRepositories(connection_1.connection)).map((name) => {
    const repository = mongoose_orm_1.getRepositories(connection_1.connection)[name];
    return {
        path: "/entity/" + _.kebabCase(name),
        repository,
        middlewares: [auth_1.FetchUser],
        routes: entity_controller_1.customEntityRoutes(name),
    };
}));
//# sourceMappingURL=entity.router.js.map