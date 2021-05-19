import { connection } from "@/config/connection";
import { createRouterApi } from "@/helpers/gateway";
import { FetchUser } from "@/middlewares/auth";
import { getRepositories } from "mongoose-orm";
import { customEntityRoutes } from "./entity.controller";

export default createRouterApi(
  Object.keys(getRepositories(connection)).map((name) => {
    const repository = getRepositories(connection)[name];
    return {
      path: "/entity/" + _.kebabCase(name),
      repository,
      middlewares: [FetchUser],
      routes: customEntityRoutes(name),
    };
  })
);
