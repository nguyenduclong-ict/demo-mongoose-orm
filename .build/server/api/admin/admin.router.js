"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gateway_1 = require("@/helpers/gateway");
const auth_1 = require("@/middlewares/auth");
const admin_controller_1 = require("./admin.controller");
exports.default = gateway_1.createRouterApi({
    path: "/admin",
    routes: {
        "PUT /update-permission": [admin_controller_1.updatePermission],
        "GET /schemas": admin_controller_1.getSchemas,
        "GET /apis": admin_controller_1.handleGetApis,
    },
    middlewares: [auth_1.isAuthenticated],
    apiMiddlewares: [auth_1.ApiPermission],
});
//# sourceMappingURL=admin.router.js.map