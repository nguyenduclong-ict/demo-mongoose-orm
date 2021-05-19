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
exports.Gateway = exports.createRouterApi = exports.RouterApi = exports.apis = void 0;
const auth_1 = require("@/middlewares/auth");
const express_1 = require("express");
const globby_1 = __importDefault(require("globby"));
const error_1 = require("./error");
// prettier-ignore
const gSpace = (txt, length) => txt + new Array(Math.max(0, length - txt.length)).fill(" ").join("");
exports.apis = [];
class RouterApi {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.RouterApi = RouterApi;
function createRouterApi(data) {
    if (Array.isArray(data)) {
        data = data.map((e) => new RouterApi(e));
    }
    else {
        data = new RouterApi(data);
    }
    return data;
}
exports.createRouterApi = createRouterApi;
const parseRequestQuery = (req, res, next) => {
    const query = req.query;
    const keys = [
        "query",
        "populates",
        "page",
        "pageSize",
        "projection",
        "softDelete",
        "select",
        "exact",
        "sort",
        "limit",
        "skip",
    ];
    Object.keys(query).forEach((key) => {
        if (typeof query[key] === "string" && keys.includes(key)) {
            try {
                query[key] = JSON.parse(query[key]);
            }
            catch (error) { }
        }
    });
    next();
};
const log = {
    prefix: "/",
    registerRoute(method, path, handlers) {
        console.log("%s %s => %s", gSpace(method, 7).toUpperCase().cyan, (this.prefix + path).replace(/\/+/g, "/").green, handlers.map((h) => h.name.cyan).join(" => "));
    },
    register(method, item, path, action) {
        console.log("%s %s => %s.%s", gSpace(method, 7).toUpperCase().cyan, (this.prefix + item.path + path).replace(/\/+/g, "/").green, item.repository.name.cyan, action.cyan);
    },
    error(method, item, path, action, error) {
        console.error("%s %s => %s.%s", method.cyan, (this.prefix + item.path + path).replace(/\/+/g, "/").green, item.repository.name.cyan, action.cyan, error);
    },
};
const vError = (rs) => {
    var _a;
    return error_1.createError(422, (_a = rs.errors[0]) === null || _a === void 0 ? void 0 : _a.message, {
        data: rs.errors,
        code: error_1.ERROR_CODES.VALIDATOR_ERROR,
    });
};
class Gateway {
    constructor(app, prefix) {
        this.apis = [];
        this.app = app;
        this.prefix = prefix || "/";
        this.log = Object.assign(Object.assign({}, log), { prefix: this.prefix });
        return this;
    }
    registerCrud(api) {
        const methods = api.crudMethods || [
            "list",
            "find",
            "findOne",
            "create",
            "bulkCreate",
            "update",
            "updateOne",
            "delete",
            "deleteOne",
        ];
        const repository = api.repository;
        const router = api.router;
        const has = (name) => methods.find((item) => item === name || item.name === name);
        const h = {};
        if ((h.list = has("list"))) {
            const mds = h.list.middlewares || [
                auth_1.EntityPermission(repository.name, "read"),
            ];
            router.get("/", parseRequestQuery, ...mds, (req, res, next) => {
                var _a;
                const ctx = Object.assign(Object.assign({}, req.query), { meta: req.meta });
                const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString().trim();
                if (search) {
                    let text = _.has(req.query, "exact") ? '"' + search + '"' : search;
                    _.set(ctx, "query.$text.$search", text);
                }
                return repository
                    .list(ctx)
                    .then((data) => res.json(data))
                    .catch((error) => {
                    this.log.error("GET", api, "/", "list", error);
                    next(error);
                });
            });
            exports.apis.push({
                type: "CRUD",
                method: "GET",
                action: "list",
                group: api.path,
                description: api.description,
                path: api.path,
            });
            this.log.register("GET", api, "/", "list");
        }
        if ((h.find = has("find"))) {
            const mds = h.find.middlewares || [
                auth_1.EntityPermission(repository.name, "read"),
            ];
            router.get("/find", parseRequestQuery, ...mds, (req, res, next) => {
                var _a;
                const ctx = Object.assign(Object.assign({}, req.query), { meta: req.meta });
                const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString().trim();
                if (search) {
                    let text = _.has(req.query, "exact") ? '"' + search + '"' : search;
                    _.set(ctx, "query.$text.$search", text);
                }
                return repository
                    .find(ctx)
                    .then((data) => res.json(data))
                    .catch((error) => {
                    this.log.error("GET", api, "/find", "find", error);
                    next(error);
                });
            });
            exports.apis.push({
                type: "CRUD",
                method: "GET",
                action: "find",
                group: api.path,
                description: api.description,
                path: api.path + "/find",
            });
            this.log.register("GET", api, "/find", "find");
        }
        if ((h.findOne = has("findOne"))) {
            const mds = h.findOne.middlewares || [
                auth_1.EntityPermission(repository.name, "read"),
            ];
            router.get("/find-one", parseRequestQuery, ...mds, (req, res, next) => {
                var _a;
                const ctx = Object.assign(Object.assign({}, req.query), { meta: req.meta });
                const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString().trim();
                if (search) {
                    let text = _.has(req.query, "exact") ? '"' + search + '"' : search;
                    _.set(ctx, "query.$text.$search", text);
                }
                return repository
                    .findOne(ctx)
                    .then((data) => res.json(data))
                    .catch((error) => {
                    this.log.error("GET", api, "/find-one", "findOne", error);
                    next(error);
                });
            });
            exports.apis.push({
                type: "CRUD",
                method: "GET",
                action: "findOne",
                group: api.path,
                description: api.description,
                path: api.path + "/find-one",
            });
            this.log.register("GET", api, "/find-one", "findOne");
        }
        if ((h.create = has("create"))) {
            const mds = h.create.middlewares || [
                auth_1.EntityPermission(repository.name, "create"),
            ];
            router.post("/", ...mds, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = req.body.data;
                    const validateResult = yield repository.validateEntity(data);
                    if (!validateResult.valid) {
                        return next(vError(validateResult));
                    }
                    const response = yield repository.create(Object.assign(Object.assign({}, req.body), { meta: req.meta }));
                    return res.json(response);
                }
                catch (error) {
                    this.log.error("POST", api, "/", "create", error);
                    next(error);
                }
            }));
            exports.apis.push({
                type: "CRUD",
                method: "POST",
                action: "create",
                group: api.path,
                description: api.description,
                path: api.path,
            });
            this.log.register("POST", api, "/", "createOne");
        }
        if ((h.bulkCreate = has("bulkCreate"))) {
            const mds = h.bulkCreate.middlewares || [
                auth_1.EntityPermission(repository.name, "create"),
            ];
            router.post("/bulk-create", ...mds, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = req.body.data;
                    if (!data || !Array.isArray(data)) {
                        return next(error_1.createError(422, "data must be array"));
                    }
                    for (let index = 0; index < data.length; index++) {
                        const entity = data[index];
                        const validateResult = yield repository.validateEntity(entity);
                        if (!validateResult.valid) {
                            return next(vError(validateResult));
                        }
                    }
                    const response = yield repository.createMany(Object.assign(Object.assign({}, req.body), { meta: req.meta }));
                    return res.json(response);
                }
                catch (error) {
                    this.log.error("POST", api, "/bulk-create", "bulkCreate", error);
                    next(error);
                }
            }));
            exports.apis.push({
                type: "CRUD",
                method: "POST",
                action: "bulkCreate",
                group: api.path,
                description: api.description,
                path: api.path + "/bulk-create",
            });
            this.log.register("POST", api, "/bulk-create", "create");
        }
        if ((h.update = has("update"))) {
            const mds = h.update.middlewares || [
                auth_1.EntityPermission(repository.name, "update"),
            ];
            router.put("/", ...mds, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield repository.update(Object.assign(Object.assign({}, req.body), { meta: req.meta }));
                    return res.json(response);
                }
                catch (error) {
                    this.log.error("POST", api, "/", "update", error);
                    next(error);
                }
            }));
            exports.apis.push({
                type: "CRUD",
                method: "PUT",
                action: "update",
                group: api.path,
                description: api.description,
                path: api.path,
            });
            this.log.register("PUT", api, "/", "update");
        }
        if ((h.updateOne = has("updateOne"))) {
            const mds = h.updateOne.middlewares || [
                auth_1.EntityPermission(repository.name, "update"),
            ];
            router.put("/:id", ...mds, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield repository.updateOne(Object.assign(Object.assign({}, req.body), { query: {
                            id: req.params.id,
                        }, meta: req.meta }));
                    return res.json(data);
                }
                catch (error) {
                    this.log.error("PUT", api, "/:id", "updateOne", error);
                    next(error);
                }
            }));
            exports.apis.push({
                type: "CRUD",
                method: "PUT",
                action: "updateOne",
                group: api.path,
                description: api.description,
                path: api.path + "/:id",
            });
            this.log.register("PUT", api, "/:id", "updateOne");
        }
        if ((h.delete = has("delete"))) {
            const mds = h.delete.middlewares || [
                auth_1.EntityPermission(repository.name, "delete"),
            ];
            router.delete("/", ...mds, (req, res, next) => {
                repository
                    .delete(Object.assign(Object.assign({}, req.body), { meta: req.meta }))
                    .then((data) => res.json(data))
                    .catch((error) => {
                    this.log.error("DELETE", api, "/", "delete", error);
                    next(error);
                });
            });
            exports.apis.push({
                type: "CRUD",
                method: "DELETE",
                action: "delete",
                group: api.path,
                description: api.description,
                path: api.path,
            });
            this.log.register("DELETE", api, "/", "delete");
        }
        if ((h.deleteOne = has("deleteOne"))) {
            const mds = h.deleteOne.middlewares || [
                auth_1.EntityPermission(repository.name, "delete"),
            ];
            router.delete("/:id", ...mds, (req, res, next) => {
                repository
                    .delete({
                    query: { id: req.params.id },
                    meta: req.meta,
                })
                    .then((data) => res.json(data))
                    .catch((error) => {
                    this.log.error("DELETE", api, "/:id", "delete", error);
                    next(error);
                });
            });
            exports.apis.push({
                type: "CRUD",
                method: "DELETE",
                action: "deleteOne",
                group: api.path,
                description: api.description,
                path: api.path + "/:id",
            });
            this.log.register("DELETE", api, "/:id", "delete");
        }
    }
    registerRoutes(folderPath, filterOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const modules = yield globby_1.default(folderPath, filterOptions);
            modules.forEach((filePath) => {
                const api = require(filePath).default;
                if (Array.isArray(api)) {
                    api.forEach((e) => this.registerRouterApi(e));
                }
                else {
                    this.registerRouterApi(api);
                }
            });
        });
    }
    registerRouterApi(api) {
        if (!api || !api.path)
            return;
        if (!api.router) {
            api.router = express_1.Router();
            if (api.middlewares && api.middlewares.length) {
                api.router.use(...api.middlewares);
            }
            if (api.repository)
                this.registerCrud(api);
            // Register custom routes
            if (api.routes) {
                Object.keys(api.routes).forEach((key) => {
                    var _a;
                    let handlers = api.routes[key] || [];
                    handlers = Array.isArray(handlers) ? handlers : [handlers];
                    if ((_a = api.apiMiddlewares) === null || _a === void 0 ? void 0 : _a.length)
                        handlers.unshift(...api.apiMiddlewares);
                    if (handlers.length) {
                        if (!handlers.length)
                            return;
                        const method = key.split(" ").shift().toLocaleLowerCase();
                        // prettier-ignore
                        if (!["post", "get", "post", "put", "patch", "delete", "connect", "options", "trace", "head"].includes(method))
                            return;
                        const endpoint = key.split(" ").pop();
                        if (!endpoint)
                            return;
                        // @ts-expect-error
                        api.router[method](endpoint, ...handlers);
                        this.log.registerRoute(method, api.path + endpoint, handlers);
                        exports.apis.push({
                            method: method.toLocaleUpperCase(),
                            path: api.path + endpoint,
                            group: api.path,
                            description: api.description,
                        });
                    }
                });
            }
        }
        this.apis.push(api);
        this.app.use(api.path, api.router);
    }
}
exports.Gateway = Gateway;
//# sourceMappingURL=gateway.js.map