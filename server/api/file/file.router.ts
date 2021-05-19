import { createRouterApi } from "@/helpers/gateway";
import { handleGetFile } from "./file.controller";

export default createRouterApi({
  path: "/file",
  routes: {
    "GET /:fileName": handleGetFile,
  },
});
