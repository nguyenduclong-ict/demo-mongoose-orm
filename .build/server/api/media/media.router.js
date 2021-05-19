"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gateway_1 = require("@/helpers/gateway");
const auth_1 = require("@/middlewares/auth");
const media_controller_1 = require("./media.controller");
exports.default = gateway_1.createRouterApi({
    path: "/media",
    routes: {
        "POST /upload": [media_controller_1.upload.single("file"), auth_1.FetchUser, media_controller_1.uploadSingleFile],
    },
});
//# sourceMappingURL=media.router.js.map