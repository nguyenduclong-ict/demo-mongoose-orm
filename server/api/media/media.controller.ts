import { E } from "@/config";
import { UPLOAD_PATH } from "@/config/env";
import { mediaRepository } from "@/entities/account";
import { MediaSource } from "@/entities/account/Media";
import { createError } from "@/helpers";
import { compareObjectId } from "@/helpers/utils";
import { RequestHandler } from "express";
import { uniqueId } from "lodash";
import { Types } from "mongoose";
import { getObjectId } from "mongoose-orm";
import multer from "multer";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

export const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_PATH,
    filename: (req, file, callback) => {
      callback(
        null,
        Types.ObjectId().toHexString() +
          "-" +
          slugify(file.originalname, { lower: true })
      );
    },
  }),
});

export const uploadSingleFile: RequestHandler = async (req, res, next) => {
  try {
    const media = await mediaRepository.create({
      data: {
        name: req.file.filename,
        path: req.file.path.replace(UPLOAD_PATH, ""),
        type: MediaSource.LOCAL,
        isPublic: req.body.isPublic ?? true,
        size: req.file.size,
        fileType: req.file.mimetype,
      },
      meta: req.meta,
      populates: ["createdBy", "updatedBy"],
    });
    res.json(media);
  } catch (error) {
    console.error("uploadSingleFile", error);
    next(error);
  }
};

export const addThumbnail: RequestHandler = async (req, res, next) => {
  if (!req.params.id) {
    return next(createError(404, "File not found"));
  }

  const media = await mediaRepository.findOne({
    query: {
      id: getObjectId(req.params.id),
    },
  });

  if (!media) {
    return next(createError(404, "File not found"));
  }

  const result = await mediaRepository.updateOne({
    query: {
      id: getObjectId(req.params.id),
    },

    data: {
      $push: {
        thumbs: {
          id: uuidv4(),
          path: req.file.path.replace(UPLOAD_PATH, ""),
          width: +req.body.width,
          height: +req.body.height,
          size: req.file.size,
        },
      },
    },
  });

  res.json(result);
};

export const deleteThumbnail: RequestHandler = async (req, res, next) => {
  if (!req.params.id) {
    return next(createError(404, "File not found"));
  }

  const media = await mediaRepository.findOne({
    query: {
      id: getObjectId(req.params.id),
    },
  });

  if (!media) {
    return next(createError(404, "File not found"));
  }

  if (
    !req.meta.user.isAdmin &&
    !compareObjectId(req.meta.user.id, media.createdBy)
  ) {
    return next(E.Unauthorized());
  }

  const thumb = media.thumbs.find((e) =>
    compareObjectId(e.id, req.params.thumbId)
  );

  if (!thumb) {
    return next(E.NotFound());
  }

  await fs.promises
    .unlink(path.join(UPLOAD_PATH, thumb.path))
    .catch((e) => null);

  await mediaRepository.updateOne({
    query: { id: media.id },
    data: {
      $pull: {
        thumbs: {
          id: thumb.id,
        },
      },
    },
  });

  res.json(true);
};
