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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPermission = exports.EntityPermission = exports.checkRoles = exports.Authorization = exports.FetchUser = exports.isAuthenticated = void 0;
const config_1 = require("@/config");
const account_1 = require("@/entities/account");
const helpers_1 = require("@/helpers/");
const error_1 = require("@/helpers/error");
const permission_1 = require("@/helpers/permission");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_orm_1 = require("mongoose-orm");
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = helpers_1.Utils.getBearerToken(req.headers.authorization);
        if (!token)
            return next(error_1.createError(401, "Token not found"));
        const tokenData = helpers_1.Utils.resolveToken(token);
        const user = yield account_1.userRepository.fetchUser(tokenData.id);
        if (!user)
            return next(error_1.createError(401, "User not found"));
        req.meta.user = user;
        req.meta.authenticated = true;
        next();
    }
    catch (error) {
        console.error("isAuthenticated", error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(error_1.createError(401, error.message));
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(error_1.createError(401, error.message));
        }
        next(error);
    }
});
exports.isAuthenticated = isAuthenticated;
const FetchUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.meta.authenticated) {
            const token = helpers_1.Utils.getBearerToken(req.headers.authorization);
            if (token) {
                const tokenData = helpers_1.Utils.resolveToken(token);
                if (tokenData) {
                    const user = yield account_1.userRepository.fetchUser(tokenData.id);
                    if (user) {
                        req.meta = req.meta || {};
                        req.meta.user = user;
                        req.meta.authenticated = true;
                    }
                }
            }
        }
    }
    catch (error) {
        console.error("FetchUser", error);
    }
    next();
});
exports.FetchUser = FetchUser;
const Authorization = (options) => ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.meta.user.isAdmin)
        return next();
    const { roles } = options;
    let canNext = false, message;
    if (roles) {
        const userRoles = req.meta.user.roles.map((r) => r.code);
        if (typeof roles === "function") {
            canNext = yield roles.call(null, req, res, next);
            message = !canNext && req.meta.message;
        }
        if (!exports.checkRoles(userRoles, ...roles)) {
            canNext = false;
            message =
                "Require roles " + Array.isArray(roles)
                    ? roles
                        .map((r) => Array.isArray(r) ? "[" + r.join(", ") + "]" : r)
                        .join(", ")
                    : roles;
        }
    }
    if (!canNext)
        return next(error_1.createError(403, message));
    next();
}));
exports.Authorization = Authorization;
const checkRoles = (userRoles, ...roles) => {
    return roles.some((role) => {
        if (typeof role === "string") {
            return userRoles.includes(role);
        }
        if (Array.isArray(role)) {
            return role.every((child) => userRoles.includes(child));
        }
    });
};
exports.checkRoles = checkRoles;
const EntityPermission = (entityName, action) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.meta.user) === null || _a === void 0 ? void 0 : _a.isAdmin) {
        return next();
    }
    action = Array.isArray(action) ? action : [action];
    const permissions = req.meta.permissions ||
        (yield account_1.userRepository.getUserPermissions(req.meta.user));
    const permission = permissions.find((item) => {
        return (item.entityType === "entity" &&
            item.entity === entityName &&
            item.status === true &&
            action.includes(item.action));
    });
    if (!permission) {
        return next(config_1.E.Forbidden("Bạn không có quyền '{action}' với '{entityName}'".format({
            entityName,
            action,
        })));
    }
    if (permission.onlySelf) {
        if (req.method === "GET") {
            _.set(req.query, "query.createdBy", mongoose_orm_1.getObjectId(req.meta.user));
        }
        else {
            _.set(req.body, "query.createdBy", mongoose_orm_1.getObjectId(req.meta.user));
        }
    }
    req.meta.permissions = permissions;
    next();
});
exports.EntityPermission = EntityPermission;
const ApiPermission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if ((_b = req.meta.user) === null || _b === void 0 ? void 0 : _b.isAdmin) {
        return next();
    }
    const originPath = _.get(req, "_parsedOriginalUrl.pathname");
    let path;
    if (req.route) {
        path = req.originalUrl.replace(req.path, "") + req.route.path;
    }
    else {
        path = originPath;
    }
    const method = req.method;
    const permissions = req.meta.permissions ||
        (yield account_1.userRepository.getUserPermissions(req.meta.user));
    const checkPermission = new permission_1.CheckPermission(permissions, req.meta.user);
    if (!checkPermission.hasApiPermission(path, method)) {
        return next(config_1.E.Forbidden("Bạn không có quyền truy cập đường dẫn này"));
    }
    req.meta.permissions = permissions;
    next();
});
exports.ApiPermission = ApiPermission;
//# sourceMappingURL=auth.js.map