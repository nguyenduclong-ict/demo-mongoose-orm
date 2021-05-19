import path from "path";

export const UPLOAD_PATH =
  process.env.UPLOAD_PATH ||
  path.resolve(process.cwd(), process.env.STATIC_PATH, "upload");
