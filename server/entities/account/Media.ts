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

export enum MediaSource {
  LOCAL = "local",
  EXTERNAL = "external",
}

@Entity<Media>({
  indexes: [{ fields: { name: "text" } }],
  timestamps: true,
  owner: true,
})
export class Media {
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

  @Field({ type: Array, of: String, default: [] })
  thumbnails?: string[];

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
    return urljoin(process.env.SERVER_URL, "/api/file", this.name);
  if (this.type === MediaSource.EXTERNAL) return this.src;
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
        const filePaths = [media.path, ...(media.thumbnails || [])];
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
