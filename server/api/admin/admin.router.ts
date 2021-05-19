import { createRouterApi } from "@/helpers/gateway";
import { ApiPermission, isAuthenticated } from "@/middlewares/auth";
import {
  getSchemas,
  handleGetApis,
  updatePermission,
} from "./admin.controller";

export default createRouterApi({
  path: "/admin",
  routes: {
    "PUT /update-permission": [updatePermission],
    "GET /schemas": getSchemas,
    "GET /apis": handleGetApis,
  },
  middlewares: [isAuthenticated],
  apiMiddlewares: [ApiPermission],
});
