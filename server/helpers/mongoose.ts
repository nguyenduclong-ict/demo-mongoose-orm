import _ from "lodash";
import { DocumentDefinition } from "mongoose";
import { KEYS, Repository } from "mongoose-orm";
import slugify from "slugify";

export const Slug = (
  fields: string | string[],
  randomId = false,
  check: any = null
) => {
  return function (this: any) {
    if (check && !check(this)) return;
    if (typeof fields === "string") fields = [fields];
    let slug = fields
      .map((field) => slugify(_.get(this, field), { lower: true }))
      .join("-");
    if (randomId) {
      slug += "-" + Math.random().toString(36).slice(2, 8);
    }
    return slug;
  };
};

export interface PopulateOptions<E> {
  ref: string;
  localField: keyof DocumentDefinition<E>;
  foreignField: string;
  justOne?: boolean;
  match?: any;
}

export function SchemaPopulates<E>(
  schema: any,
  populates:
    | { [x in keyof DocumentDefinition<E>]?: PopulateOptions<E> }
    | { [x: string]: PopulateOptions<E> }
) {
  const options = _.get(schema, KEYS.SCHEMA_OPTIONS, {});
  for (const key in populates) {
    if (Object.prototype.hasOwnProperty.call(populates, key)) {
      // @ts-ignore
      schema.virtual(key, populates[key]);
      options.populates = options.populates || [];
      options.populates.push(key);
    }
  }
}

export class IEntity {
  _id?: any;
  id?: any;

  createdAt?: Date;
  updatedAt?: Date;
}

export function getEntityForm(repository: Repository) {
  const options = _.get(repository.schema, KEYS.SCHEMA_PATHS);
  const result: any = {};
  const getType = (t: any) => t?.schemaName || t?.name;
  Object.keys(options).forEach((key) => {
    const field: any = {};
    let origin;
    const option = options[key];
    if (Array.isArray(option)) {
      field.type === "Array";
      field.arrayType = getType(option[0].type);
      field.ref = option[0].ref;
      origin = option[0];
    } else if (Array.isArray(option.type)) {
      field.type = "Array";
      field.ref = option.type[0].ref;
      field.arrayType = getType(option.type[0].type);
      origin = option;
    } else {
      field.type = getType(option.type);
      field.ref = option.ref;
      origin = option;
    }

    field.type = field.type || "String";
    Object.assign(
      field,
      _.pick(option, "name", "description", "default", "ui")
    );
    Object.assign(
      field,
      _.pick(
        origin,
        "required",
        "max",
        "min",
        "maxlength",
        "minlength",
        "enum",
        "default",
        "validator",
        "unique",
        "props",
        "ui"
      )
    );
    result[key] = field;
  });
  return result;
}

// Register global hooks
Repository.registerHook(
  "before",
  ["create"],
  function (ctx: MongooseOrm.ContextCreate) {
    const options = this.schema[KEYS.SCHEMA_OPTIONS];
    if (options.owner) ctx.data.createdBy = ctx.meta?.user?.id;
  }
);
Repository.registerHook(
  "before",
  ["create"],
  function (ctx: MongooseOrm.ContextCreate) {
    const options = this.schema[KEYS.SCHEMA_OPTIONS];
    if (options.owner) ctx.data.createdBy = ctx.meta?.user?.id;
  }
);

Repository.registerHook(
  "before",
  ["createMany"],
  function (ctx: MongooseOrm.ContextCreateMany) {
    const options = this.schema[KEYS.SCHEMA_OPTIONS];
    if (options.owner)
      ctx.data.forEach((entity) => {
        entity.createdBy = ctx.meta?.user?.id;
      });
  }
);

Repository.registerHook(
  "before",
  ["update", "updateOne"],
  function (ctx: MongooseOrm.ContextCreate) {
    const options = this.schema[KEYS.SCHEMA_OPTIONS];
    if (options.owner) ctx.data.updatedBy = ctx.meta?.user?.id;
  }
);
