import { E } from "@/config";
import { UPLOAD_PATH } from "@/config/env";
import { ROLES } from "@/config/roles";
import { mediaRepository } from "@/entities";
import { compareObjectId, renameFile, checkFileExists } from "@/helpers/utils";
import { RequestHandler } from "express";
import { getObjectId } from "mongoose-orm";
import sharp from "sharp";
import path from "path";

export const handleGetFile: RequestHandler = async (req, res, next) => {
  const media = await mediaRepository.findOne({
    query: {
      name: req.params.fileName,
    },
  });
  if (!media) {
    throw E.NotFound();
  }
  const user = req.meta.user;
  if (media.isPublic === false) {
    if (!user) throw E.Forbidden();
    if (
      !user.roles.find(
        (role) => role.code === ROLES.ADMIN || role.code === ROLES.STAFF
      )
    ) {
      throw E.Forbidden();
    }

    if (!compareObjectId(user.id, media.createdBy)) throw E.Forbidden();
  }

  const filePath = path.join(UPLOAD_PATH, media.path);
  const size = req.query.size as string;
  if (size) {
    let [width, height]: any = size.split("x");
    width = +width || undefined;
    height = +height || undefined;
    const filePathResized = renameFile(
      filePath,
      (n) => n + `_${width}x${height}`
    );
    try {
      const exists = await checkFileExists(filePathResized);
      if (!exists) {
        await sharp(filePath).resize(width, height).toFile(filePathResized);
        await mediaRepository.updateOne({
          query: {
            id: getObjectId(media),
          },
          data: {
            $push: {
              thumbnails: filePathResized.replace(
                RegExp(`^${UPLOAD_PATH}`),
                ""
              ),
            },
          },
        });
        return res.sendFile(filePathResized);
      } else {
        return res.sendFile(filePathResized);
      }
    } catch (error) {
      console.error("Resize file error", error);
    }
  } else {
    return res.sendFile(filePath);
  }
};
