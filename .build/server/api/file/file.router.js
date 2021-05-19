"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gateway_1 = require("@/helpers/gateway");
const file_controller_1 = require("./file.controller");
exports.default = gateway_1.createRouterApi({
    path: "/file",
    routes: {
        "GET /:fileName": file_controller_1.handleGetFile,
    },
});
//# sourceMappingURL=file.router.js.map