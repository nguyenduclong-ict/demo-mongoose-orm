import { connection } from "@/config/connection";
import { SchemaTypes } from "mongoose";
import {
  createSchema,
  Entity,
  Field,
  Hook,
  Inject,
  Repository,
} from "mongoose-orm";
import urljoin from "url-join";
import { User } from "./User";
import fs from "fs";
import path from "path";
import { UPLOAD_PATH } from "@/config/env";
import { Form, IEntity } from "@/helpers";

export enum MediaSource {
  LOCAL = "local",
  EXTERNAL = "external",
}

@Entity<Media>({
  indexes: [{ fields: { name: "text" } }],
  timestamps: true,
  owner: true,
})
export class Media extends IEntity {
  @Field({ type: String })
  name: string;

  url?: string;

  @Field({ type: Boolean, default: true })
  isPublic: Boolean;

  @Field({ type: String })
  src?: string; // source for firebase

  @Field({ type: String })
  path?: string; // path to local

  @Field({ type: SchemaTypes.String, default: "" })
  alt?: string;

  @Field({ type: Number, default: 0 })
  size?: number;

  @Field({ type: Array, of: SchemaTypes.Mixed, default: [] })
  @Form({ type: "JSON" })
  thumbs?: {
    path?: string;
    width?: number;
    height?: number;
    url?: string;
    size?: number;
    id: any;
    description?: string;
  }[];

  thumbnails?: {
    path?: string;
    width?: number;
    height?: number;
    url?: string;
    id: any;
    description?: string;
  }[];

  @Field({ type: SchemaTypes.String })
  fileType?: string;

  @Field({ type: String, enum: Object.values(MediaSource) })
  type: MediaSource;

  @Field({ type: SchemaTypes.ObjectId, ref: User.name })
  createdBy?: User;

  @Field({ type: SchemaTypes.ObjectId, ref: User.name })
  updatedBy?: User;
}

export const MediaSchema = createSchema(Media);

MediaSchema.virtual("url").get(function (this: any) {
  if (this.type === MediaSource.LOCAL)
    return urljoin(process.env.SERVER_URL, "/api/file", this.id);
  if (this.type === MediaSource.EXTERNAL) return this.src;
});

MediaSchema.virtual("thumbnails").get(function (this: any) {
  return this.thumbs.map((thum: any) => {
    return {
      ...thum,
      url: urljoin(process.env.SERVER_URL, "/api/file", this.id, thum.id),
    };
  });
});

MediaSchema.virtual("serverUrl").get(function (this: any) {
  return process.env.SERVER_URL;
});

@Inject<Repository>({ connection, schema: MediaSchema })
export class MediaRepository extends Repository<Media> {
  @Hook("before", ["delete"])
  async beforeDelete(ctx: MongooseOrm.Context<Media>) {
    const deleted = await this.find({ query: ctx.query });
    console.log(deleted);
    ctx.meta.deleted = deleted;
  }

  @Hook("after", ["delete"])
  async afterDelete(ctx: MongooseOrm.Context<Media>, result: any) {
    const deleted: Media[] = ctx.meta.deleted;

    await Promise.all(
      deleted.map((media) => {
        const filePaths = [
          media.path,
          ...(media.thumbnails.map((e) => e.path).filter((e) => !!e) || []),
        ];
        return Promise.all(
          filePaths.map((filePath) =>
            fs.promises
              .unlink(path.join(UPLOAD_PATH, filePath))
              .catch((e) => null)
          )
        );
      })
    );

    return result;
  }
}
