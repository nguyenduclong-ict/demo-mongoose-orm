import { createRouterApi } from "@/helpers/gateway";
import { ApiPermission, isAuthenticated } from "@/middlewares/auth";
import {
  getEntities,
  handleGetApis,
  updatePermission,
} from "./admin.controller";

export default createRouterApi({
  path: "/admin",
  routes: {
    "PUT /update-permission": [updatePermission],
    "GET /entities": getEntities,
    "GET /apis": handleGetApis,
  },
  middlewares: [isAuthenticated],
  apiMiddlewares: [ApiPermission],
});
