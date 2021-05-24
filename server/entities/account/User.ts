import { connection } from "@/config/connection";
import { Form, IEntity, SchemaPopulates } from "@/helpers/mongoose";
import { SchemaTypes, FilterQuery } from "mongoose";
import {
  createSchema,
  Entity,
  Field,
  getObjectId,
  Inject,
  Repository,
} from "mongoose-orm";
import { permissionRepository } from ".";
import { Permission } from "./Permission";
import { Role } from "./Role";

@Entity<User>({
  indexes: [
    { fields: { username: 1, phone: 1, email: 1 }, options: { unique: true } },
  ],
})
export class User extends IEntity {
  @Field({ type: String, unique: true })
  username: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field({ type: String, required: true })
  password: string;

  @Field({ type: String, unique: true })
  facebookId: string;

  @Field({ type: Boolean, default: false })
  blocked: boolean;

  @Field({ type: Boolean, default: false })
  isAdmin?: boolean;

  @Field({ type: String })
  @Form({ type: "MediaPicker" })
  avatar: string;

  @Field({ type: SchemaTypes.Mixed, default: {} })
  profile: {
    name?: string;
    gender?: "male" | "female";
    avatar: string;
  };

  @Field({
    type: [{ type: SchemaTypes.ObjectId, ref: Role.name }],
    default: [],
  })
  roles: Role[];
}

export const UserSchema = createSchema(User);

@Inject<Repository>({ connection: connection, schema: UserSchema })
export class UserRepository extends Repository<User> {
  fetchUser(id: any) {
    return this.findOne({
      query: {
        _id: id,
      },
      populates: ["roles"],
    });
  }

  async getUserPermissions(id: any) {
    const user = id
      ? await this.findOne({
          query: { id: getObjectId(id) },
          populates: ["roles"],
        })
      : null;
    const query: FilterQuery<Permission> = {
      $or: [{ isAnonymous: true }],
    };
    if (user) {
      query.$or = query.$or || [];
      query.$or.push(
        { user: getObjectId(id) },
        {
          role: {
            $in: user.roles.map((role) => getObjectId(role)),
          },
        },
        { isAuthenticated: true }
      );
    }
    return permissionRepository.find({
      query,
      limit: Number.MAX_SAFE_INTEGER,
    });
  }
}
