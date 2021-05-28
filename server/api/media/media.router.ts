import { createRouterApi } from "@/helpers/gateway";
import { FetchUser, isAuthenticated } from "@/middlewares/auth";
import {
  addThumbnail,
  upload,
  uploadSingleFile,
  deleteThumbnail,
} from "./media.controller";

export default createRouterApi({
  path: "/media",
  routes: {
    "POST /upload": [upload.single("file"), FetchUser, uploadSingleFile],
    "POST /thumbnail/:id": [upload.single("file"), FetchUser, addThumbnail],
    "DELETE /thumbnail/:id/:thumbId": [isAuthenticated, deleteThumbnail],
  },
});
