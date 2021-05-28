import { createRouterApi } from "@/helpers/gateway";
import { handleGetFile, handleGetThumbnail } from "./file.controller";

export default createRouterApi({
  path: "/file",
  routes: {
    "GET /:id/:thumbId": handleGetThumbnail,
    "GET /:id": handleGetFile,
  },
});
