import { EntityPermission } from "@/middlewares/auth";
import { Express, RequestHandler, Router } from "express";
import globby from "globby";
import { Repository } from "mongoose-orm";
import { createError, ERROR_CODES } from "./error";

// prettier-ignore
const gSpace = (txt: string, length: number) => txt + new Array(Math.max(0, length - txt.length)).fill(" ").join("");

export const apis: any[] = [];

export class RouterApi {
  path: string;
  repository?: Repository;
  description?: string;
  crudMethods?: (
    | CrudMethod
    | {
        name: CrudMethod;
        middlewares: RequestHandler[];
      }
  )[];
  middlewares?: RequestHandler[];
  apiMiddlewares?: RequestHandler[];
  routes?: {
    [x: string]: RequestHandler | RequestHandler[];
  };
  router?: Router;

  constructor(data: RouterApi) {
    Object.assign(this, data);
  }
}

export function createRouterApi(
  data: RouterApi | RouterApi[]
): RouterApi | RouterApi[] {
  if (Array.isArray(data)) {
    data = data.map((e) => new RouterApi(e));
  } else {
    data = new RouterApi(data);
  }
  return data;
}

const parseRequestQuery: RequestHandler = (req, res, next) => {
  const query: any = req.query;
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
      } catch (error) {}
    }
  });
  next();
};

const log = {
  prefix: "/",
  registerRoute(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    handlers: any[]
  ) {
    console.log(
      "%s %s => %s",
      gSpace(method, 7).toUpperCase().cyan,
      (this.prefix + path).replace(/\/+/g, "/").green,
      handlers.map((h) => h.name.cyan).join(" => ")
    );
  },
  register(
    method: "GET" | "POST" | "PUT" | "DELETE",
    item: any,
    path: string,
    action: string
  ) {
    console.log(
      "%s %s => %s.%s",
      gSpace(method, 7).toUpperCase().cyan,
      (this.prefix + item.path + path).replace(/\/+/g, "/").green,
      item.repository.name.cyan,
      action.cyan
    );
  },
  error(
    method: "GET" | "POST" | "PUT" | "DELETE",
    item: any,
    path: string,
    action: string,
    error: any
  ) {
    console.error(
      "%s %s => %s.%s",
      method.cyan,
      (this.prefix + item.path + path).replace(/\/+/g, "/").green,
      item.repository.name.cyan,
      action.cyan,
      error
    );
  },
};

const vError = (rs: any) =>
  createError(422, rs.errors[0]?.message, {
    data: rs.errors,
    code: ERROR_CODES.VALIDATOR_ERROR,
  });

// prettier-ignore
type CrudMethod = "list"| "find"| "findOne"| "create"| "bulkCreate"| "update"| "updateOne"| "delete"| "deleteOne";

export class Gateway {
  prefix?: string;
  app: Express | Router;
  apis: RouterApi[] = [];
  log: typeof log;

  constructor(app: Express | Router, prefix?: string) {
    this.app = app;
    this.prefix = prefix || "/";
    this.log = { ...log, prefix: this.prefix };
    return this;
  }

  registerCrud(api: RouterApi) {
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

    const has = (name: string) =>
      methods.find((item) => item === name || (item as any).name === name);

    const h: { [k in CrudMethod]: any } = {} as any;

    if ((h.list = has("list"))) {
      const mds = h.list.middlewares || [
        EntityPermission(repository.name, "read"),
      ];
      router.get("/", parseRequestQuery, ...mds, (req, res, next) => {
        const ctx = { ...(req.query as any), meta: req.meta };
        const search = req.query.search?.toString().trim();
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
      apis.push({
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
        EntityPermission(repository.name, "read"),
      ];
      router.get("/find", parseRequestQuery, ...mds, (req, res, next) => {
        const ctx = { ...(req.query as any), meta: req.meta };
        const search = req.query.search?.toString().trim();
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
      apis.push({
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
        EntityPermission(repository.name, "read"),
      ];
      router.get("/find-one", parseRequestQuery, ...mds, (req, res, next) => {
        const ctx = { ...(req.query as any), meta: req.meta };
        const search = req.query.search?.toString().trim();
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
      apis.push({
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
        EntityPermission(repository.name, "create"),
      ];
      router.post("/", ...mds, async (req, res, next) => {
        try {
          const data = req.body.data;
          const validateResult = await repository.validateEntity(data);
          if (!validateResult.valid) {
            return next(vError(validateResult));
          }
          const response = await repository.create({
            ...req.body,
            meta: req.meta,
          });
          return res.json(response);
        } catch (error) {
          this.log.error("POST", api, "/", "create", error);
          next(error);
        }
      });
      apis.push({
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
        EntityPermission(repository.name, "create"),
      ];
      router.post("/bulk-create", ...mds, async (req, res, next) => {
        try {
          const data = req.body.data;
          if (!data || !Array.isArray(data)) {
            return next(createError(422, "data must be array"));
          }
          for (let index = 0; index < data.length; index++) {
            const entity = data[index];
            const validateResult = await repository.validateEntity(entity);
            if (!validateResult.valid) {
              return next(vError(validateResult));
            }
          }
          const response = await repository.createMany({
            ...req.body,
            meta: req.meta,
          });
          return res.json(response);
        } catch (error) {
          this.log.error("POST", api, "/bulk-create", "bulkCreate", error);
          next(error);
        }
      });
      apis.push({
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
        EntityPermission(repository.name, "update"),
      ];
      router.put("/", ...mds, async (req, res, next) => {
        try {
          const response = await repository.update({
            ...req.body,
            meta: req.meta,
          });
          return res.json(response);
        } catch (error) {
          this.log.error("POST", api, "/", "update", error);
          next(error);
        }
      });
      apis.push({
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
        EntityPermission(repository.name, "update"),
      ];
      router.put("/:id", ...mds, async (req, res, next) => {
        try {
          const data = await repository.updateOne({
            ...req.body,
            query: {
              id: req.params.id,
            },
            meta: req.meta,
          });
          return res.json(data);
        } catch (error) {
          this.log.error("PUT", api, "/:id", "updateOne", error);
          next(error);
        }
      });
      apis.push({
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
        EntityPermission(repository.name, "delete"),
      ];
      router.delete("/", ...mds, (req, res, next) => {
        repository
          .delete({
            ...req.body,
            meta: req.meta,
          })
          .then((data) => res.json(data))
          .catch((error) => {
            this.log.error("DELETE", api, "/", "delete", error);
            next(error);
          });
      });
      apis.push({
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
        EntityPermission(repository.name, "delete"),
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
      apis.push({
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

  async registerRoutes(
    folderPath: string | readonly string[],
    filterOptions?: globby.GlobbyOptions
  ) {
    const modules = await globby(folderPath, filterOptions);
    modules.forEach((filePath) => {
      const api: RouterApi = require(filePath).default;
      if (Array.isArray(api)) {
        api.forEach((e) => this.registerRouterApi(e));
      } else {
        this.registerRouterApi(api);
      }
    });
  }

  registerRouterApi(api: RouterApi) {
    if (!api || !api.path) return;
    if (!api.router) {
      api.router = Router();
      if (api.middlewares && api.middlewares.length) {
        api.router.use(...api.middlewares);
      }
      if (api.repository) this.registerCrud(api);
      // Register custom routes
      if (api.routes) {
        Object.keys(api.routes).forEach((key) => {
          let handlers: RequestHandler[] = (api.routes[key] as any) || [];
          handlers = Array.isArray(handlers) ? handlers : [handlers];
          if (api.apiMiddlewares?.length)
            handlers.unshift(...api.apiMiddlewares);
          if (handlers.length) {
            if (!handlers.length) return;
            const method: string = key.split(" ").shift().toLocaleLowerCase();
            // prettier-ignore
            if (!["post","get","post","put","patch","delete","connect","options","trace","head"].includes(method)) return;
            const endpoint = key.split(" ").pop();
            if (!endpoint) return;
            // @ts-expect-error
            api.router[method](endpoint, ...handlers);
            this.log.registerRoute(
              method as any,
              api.path + endpoint,
              handlers
            );
            apis.push({
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
    this.app.use(api.path as any, api.router);
  }
}
