import { connection } from "@/config/connection";
import { IEntity } from "@/helpers/mongoose";
import { SchemaTypes } from "mongoose";
import { createSchema, Entity, Field, Inject, Repository } from "mongoose-orm";
import { Role } from "./Role";
import { User } from "./User";

export type PermissionAction = "create" | "read" | "update" | "delete";

@Entity<Permission>({
  timestamps: true,
  indexes: [
    {
      fields: {
        entityType: 1,
        isAnonymous: 1,
        isAuthenticated: 1,
        role: 1,
        user: 1,
      },
    },
  ],
})
export class Permission extends IEntity {
  @Field({
    type: SchemaTypes.ObjectId,
    ref: "Role",
  })
  role?: Role; // permission for role

  @Field({
    type: SchemaTypes.ObjectId,
    ref: "User",
  })
  user?: User; // permisson for user

  @Field({
    type: String,
    enum: ["entity", "api", "admin-page"],
  })
  entityType?: "entity" | "api" | "admin-page";

  @Field({
    type: String,
    enum: ["create", "read", "update", "delete", "all"],
    default: "all",
  })
  action?: PermissionAction;

  @Field({
    type: String,
  })
  endpoint?: string;

  @Field({
    type: String,
  })
  pageName?: string;

  @Field({
    type: String,
    enum: ["GET", "POST", "PUT", "DELETE"],
  })
  method?: "GET" | "POST" | "PUT" | "DELETE";

  @Field({
    type: String,
  })
  entity?: string;

  @Field({
    type: Boolean,
    default: true,
  })
  status: boolean;

  @Field({
    type: Boolean,
    default: false,
  })
  isAuthenticated?: boolean;

  @Field({
    type: Boolean,
    default: false,
  })
  isAnonymous?: boolean;

  @Field({
    type: Boolean,
    default: false,
  })
  onlySelf?: boolean; // Chỉ áp dụng người tạo entity
}

export const PermissionSchema = createSchema(Permission);

@Inject<Repository>({ connection, schema: PermissionSchema })
export class PermissionRepository extends Repository<Permission> {}
