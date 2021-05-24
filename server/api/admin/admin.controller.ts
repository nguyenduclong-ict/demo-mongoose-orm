import { connection } from "@/config/connection";
import { permissionRepository } from "@/entities";
import { Permission } from "@/entities/account/Permission";
import { User } from "@/entities/account/User";
import { apis } from "@/helpers/gateway";
import { getEntityDeclaration } from "@/helpers/mongoose";
import { CheckPermission } from "@/helpers/permission";
import { RequestHandler } from "express";
import { getObjectId, getRepositories } from "mongoose-orm";

export const handleGetApis: RequestHandler = (req, res, next) => {
  res.json(apis);
};

export const updatePermission: RequestHandler = async (req, res, next) => {
  const permissions: Permission[] = req.body.permissions;
  const result = await Promise.all(
    permissions.map((permission) => {
      if (!getObjectId(permission)) {
        return permissionRepository.create({ data: permission });
      } else {
        return permissionRepository.updateOne({
          query: {
            id: getObjectId(permission),
          },
          data: _.omit(permission, ["id"]),
        });
      }
    })
  );
  res.json(result);
};

let cachedSchemas: any;

export const getEntities: RequestHandler = (req, res, next) => {
  try {
    if (cachedSchemas) return res.json(cachedSchemas);
    const schemas: any = {};

    const repositories = getRepositories(connection);

    Object.keys(repositories).forEach((name) => {
      const repository = repositories[name];
      const user: User = req.meta.user;
      const checkPermission = new CheckPermission(req.meta.permissions, user);
      if (checkPermission.hasEntityPermission({ key: name })) {
        schemas[name] = getEntityDeclaration(repository);
      }
    });

    cachedSchemas = schemas;
    res.json(schemas);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
