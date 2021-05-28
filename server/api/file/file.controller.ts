import { E } from "@/config";
import { UPLOAD_PATH } from "@/config/env";
import { ROLES } from "@/config/roles";
import { mediaRepository, userRepository } from "@/entities";
import { Utils } from "@/helpers";
import { compareObjectId } from "@/helpers/utils";
import { RequestHandler } from "express";
import path from "path";

export const handleGetFile: RequestHandler = async (req, res, next) => {
  try {
    const token: any = req.query.token;
    if (token) {
      const tokenData: any = Utils.resolveToken(token);
      if (tokenData) {
        const user = await userRepository.fetchUser(tokenData.id);
        if (user) {
          req.meta = req.meta || ({} as any);
          req.meta.user = user;
          req.meta.authenticated = true;
        }
      }
    }
  } catch (error) {}

  const media = await mediaRepository.findOne({
    query: {
      id: req.params.id,
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
  return res.sendFile(filePath);
};

export const handleGetThumbnail: RequestHandler = async (req, res, next) => {
  try {
    const token: any = req.query.token;
    if (token) {
      const tokenData: any = Utils.resolveToken(token);
      if (tokenData) {
        const user = await userRepository.fetchUser(tokenData.id);
        if (user) {
          req.meta = req.meta || ({} as any);
          req.meta.user = user;
          req.meta.authenticated = true;
        }
      }
    }
  } catch (error) {}

  const media = await mediaRepository.findOne({
    query: {
      id: req.params.id,
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

  const thumb = media.thumbnails.find((t) => t.id === req.params.thumbId);

  if (!thumb) {
    return res.status(404).send();
  }

  const filePath = path.join(UPLOAD_PATH, thumb.path);
  return res.sendFile(filePath);
};
