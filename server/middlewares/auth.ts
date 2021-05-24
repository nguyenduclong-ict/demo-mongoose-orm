import { E } from "@/config";
import { userRepository } from "@/entities/account";
import { PermissionAction } from "@/entities/account/Permission";
import { Utils } from "@/helpers/";
import { createError } from "@/helpers/error";
import { CheckPermission } from "@/helpers/permission";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { getObjectId } from "mongoose-orm";

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const token = Utils.getBearerToken(req.headers.authorization);
    if (!token) return next(createError(401, "Token not found"));
    const tokenData: any = Utils.resolveToken(token);
    const user = await userRepository.fetchUser(tokenData.id);
    if (!user) return next(createError(401, "User not found"));
    req.meta.user = user;
    req.meta.authenticated = true;
    next();
  } catch (error) {
    console.error("isAuthenticated", error);
    if (error instanceof jwt.TokenExpiredError) {
      return next(createError(401, error.message));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(createError(401, error.message));
    }
    next(error);
  }
};

export const FetchUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.meta.authenticated) {
      const token = Utils.getBearerToken(req.headers.authorization);
      if (token) {
        const tokenData: any = Utils.resolveToken(token);
        if (tokenData) {
          const user = await userRepository.fetchUser(tokenData.id);
          if (user) {
            req.meta = req.meta || ({} as any);
            req.meta.user = user;
            req.meta.authenticated = true;
          }
        }
      }
    }
  } catch (error) {
    console.error("FetchUser", error);
  }
  next();
};

interface AuthorizationOptions {
  roles?: string | string[] | (string | string[])[] | RequestHandler;
}

export const Authorization = (options: AuthorizationOptions) =>
  (async (req, res, next) => {
    if (req.meta.user.isAdmin) return next();
    const { roles } = options;
    let canNext = false,
      message;
    if (roles) {
      const userRoles = req.meta.user.roles.map((r) => r.code);
      if (typeof roles === "function") {
        canNext = await roles.call(null, req, res, next);
        message = !canNext && req.meta.message;
      }
      if (!checkRoles(userRoles, ...(roles as any))) {
        canNext = false;
        message =
          "Require roles " + Array.isArray(roles)
            ? (roles as any)
                .map((r: any) =>
                  Array.isArray(r) ? "[" + r.join(", ") + "]" : r
                )
                .join(", ")
            : roles;
      }
    }
    if (!canNext) return next(createError(403, message));
    next();
  }) as RequestHandler;

export const checkRoles = (
  userRoles: string[],
  ...roles: (string | string[])[]
) => {
  return roles.some((role) => {
    if (typeof role === "string") {
      return userRoles.includes(role);
    }
    if (Array.isArray(role)) {
      return role.every((child) => userRoles.includes(child));
    }
  });
};

export const EntityPermission =
  (
    entityName: string,
    action?: PermissionAction | PermissionAction[]
  ): RequestHandler =>
  async (req, res, next) => {
    if (req.meta.user?.isAdmin) {
      return next();
    }
    action = Array.isArray(action) ? action : [action];
    const permissions =
      req.meta.permissions ||
      (await userRepository.getUserPermissions(req.meta.user));

    const permission = permissions.find((item) => {
      return (
        item.entityType === "entity" &&
        item.entity === entityName &&
        item.status === true &&
        action.includes(item.action)
      );
    });

    if (!permission) {
      return next(
        E.Forbidden(
          "Bạn không có quyền '{action}' với '{entityName}'".format({
            entityName,
            action,
          })
        )
      );
    }

    if (permission.onlySelf) {
      if (req.method === "GET") {
        _.set(req.query, "query.createdBy", getObjectId(req.meta.user));
      } else {
        _.set(req.body, "query.createdBy", getObjectId(req.meta.user));
      }
    }

    req.meta.permissions = permissions;
    next();
  };

export const ApiPermission: RequestHandler = async (req, res, next) => {
  if (req.meta.user?.isAdmin) {
    return next();
  }
  const originPath = _.get(req, "_parsedOriginalUrl.pathname");
  let path: string;
  if (req.route) {
    path = req.originalUrl.replace(req.path, "") + req.route.path;
  } else {
    path = originPath;
  }
  const method = req.method;
  const permissions =
    req.meta.permissions ||
    (await userRepository.getUserPermissions(req.meta.user));
  const checkPermission = new CheckPermission(permissions, req.meta.user);
  if (!checkPermission.hasApiPermission(path, method)) {
    return next(E.Forbidden("Bạn không có quyền truy cập đường dẫn này"));
  }

  req.meta.permissions = permissions;
  next();
};
