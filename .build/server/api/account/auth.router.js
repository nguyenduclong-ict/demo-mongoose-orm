"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gateway_1 = require("@/helpers/gateway");
const auth_1 = require("@/middlewares/auth");
const auth_controller_1 = require("./auth.controller");
exports.default = gateway_1.createRouterApi({
    path: "/auth",
    routes: {
        "GET /me": [auth_1.isAuthenticated, auth_controller_1.getAccountInfo],
        "POST /login": auth_controller_1.login,
        "POST /register": auth_controller_1.register,
        "POST /login-facebook": auth_controller_1.loginWithFacebook,
        "POST /me": [auth_1.isAuthenticated, auth_controller_1.updateProfile],
        "POST /change-password": [auth_1.isAuthenticated, auth_controller_1.changePassword],
        "POST /init": auth_controller_1.initApplication,
        "GET /inited": auth_controller_1.isInitedApplication,
        "POST /logout": [auth_1.isAuthenticated, auth_controller_1.logout],
        "GET /permissions": [auth_1.FetchUser, auth_controller_1.getUserPermissions],
    },
});
//# sourceMappingURL=auth.router.js.map