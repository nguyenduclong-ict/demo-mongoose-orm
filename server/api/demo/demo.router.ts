import { createRouterApi } from "@/helpers/gateway";
import { DemoTestController } from "./DemoTest.controller";

export default createRouterApi({
  path: "/demo",
  routes: {
    "GET /test": [new DemoTestController().handler],
  },
});
