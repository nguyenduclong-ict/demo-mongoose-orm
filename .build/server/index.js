"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
require("@/helpers/mongoose");
require("@/helpers/utils");
const boxen_1 = __importDefault(require("boxen"));
require("colors");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importStar(require("express"));
const fs_1 = __importDefault(require("fs"));
const http_1 = require("http");
const lodash_1 = __importDefault(require("lodash"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
require("./entities");
const api_1 = require("./helpers/api");
const error_1 = require("./helpers/error");
const gateway_1 = require("./helpers/gateway");
lodash_1.default.set(global, "_", lodash_1.default);
const isDev = process.env.NODE_ENV !== "production";
function serverBootstrap(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app = app || express_1.default();
        const server = http_1.createServer(app);
        app.use(morgan_1.default("dev"));
        app.use(express_1.default.static(process.env.STATIC_PATH));
        // Api
        const api = express_1.Router();
        const gateway = new gateway_1.Gateway(api, "/api");
        app.use("/api", api);
        api.use(express_1.default.json());
        api.use(api_1.initRequestMeta);
        api.use(cors_1.default());
        if (!fs_1.default.existsSync(env_1.UPLOAD_PATH)) {
            console.log("Create upload path".blue, env_1.UPLOAD_PATH);
            fs_1.default.mkdirSync(env_1.UPLOAD_PATH, { recursive: true });
        }
        yield gateway.registerRoutes(path_1.default.join(__dirname, "api"), {
            expandDirectories: {
                extensions: ["ts", "js"],
                files: ["*.router.ts", "*.router.js"],
            },
        });
        api.use("/api", error_1.HandleRequestError);
        return { app, server, start: exports.start(app, server) };
    });
}
exports.default = serverBootstrap;
const start = (app, server) => {
    return function () {
        var _a;
        const port = Number(process.env.PORT || ((_a = process.env.SERVER_URL) === null || _a === void 0 ? void 0 : _a.split(":").pop()) || 5000);
        server.listen(port, () => {
            if (process.env.NODE_ENV === "production") {
                console.log(boxen_1.default([
                    "Server start success".green,
                    "",
                    "api:   " + `${process.env.SERVER_URL}/api`.yellow.bold,
                    "admin: " + `${process.env.SERVER_URL}/admin`.yellow.bold,
                ].join("\n"), {
                    borderColor: "green",
                    padding: 1,
                }));
            }
            else {
                console.log(boxen_1.default([
                    "Server start success".green,
                    "",
                    "api:   " + `${process.env.SERVER_URL}/api`.yellow.bold,
                    "admin: " +
                        `http://localhost:${process.env.ADMIN_PORT}`.yellow.bold,
                ].join("\n"), {
                    borderColor: "green",
                    padding: 1,
                }));
            }
        });
    };
};
exports.start = start;
if (isDev) {
    serverBootstrap().then(({ start }) => {
        start();
    });
}
//# sourceMappingURL=index.js.map