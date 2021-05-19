import { connection } from "@/config/connection";
import { permissionRepository } from "@/entities";
import { Permission } from "@/entities/account/Permission";
import { User } from "@/entities/account/User";
import { apis } from "@/helpers/gateway";
import { getEntityForm } from "@/helpers/mongoose";
import { CheckPermission } from "@/helpers/permission";
import { RequestHandler } from "express";
import { getObjectId, getRepositories, KEYS } from "mongoose-orm";

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

export const getSchemas: RequestHandler = (req, res, next) => {
  try {
    const schemas: any = {};
    const repositories = getRepositories(connection);

    Object.keys(repositories).forEach((name) => {
      const repository = repositories[name];
      const ops = _.get(repository.schema, KEYS.SCHEMA_OPTIONS);
      const user: User = req.meta.user;
      const checkPermission = new CheckPermission(req.meta.permissions, user);
      if (checkPermission.hasEntityPermission({ key: name })) {
        const schema = getEntityForm(repository);
        const populates: any[] = [];
        Object.keys(schema).forEach((key) => {
          if (schema[key].type === "ObjectId") {
            populates.push(key);
            if (!schema[key].props?.labelKey) {
              if (ops.owner && ["createdBy", "updatedBy"].includes(key)) {
                _.set(schema[key], "props.labelKey", "profile.name");
              } else _.set(schema[key], "props.labelKey", "name");
            }
          }
        });
        schemas[name] = {
          key: name,
          name: ops.name || name,
          description: ops.description,
          populates: _.uniq(populates.concat(...(ops.populates || []))),
          endpoint: "/entity/" + _.kebabCase(name),
          schema,
        };
      }
    });
    res.json(schemas);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
