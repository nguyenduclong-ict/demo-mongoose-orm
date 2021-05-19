import { UPLOAD_PATH } from "@/config/env";
import { mediaRepository } from "@/entities/account";
import { MediaSource } from "@/entities/account/Media";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import multer from "multer";
import slugify from "slugify";

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
