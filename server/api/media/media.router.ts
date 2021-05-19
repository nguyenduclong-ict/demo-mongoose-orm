import { createRouterApi } from "@/helpers/gateway";
import { FetchUser } from "@/middlewares/auth";
import { upload, uploadSingleFile } from "./media.controller";

export default createRouterApi({
  path: "/media",
  routes: {
    "POST /upload": [upload.single("file"), FetchUser, uploadSingleFile],
  },
});
