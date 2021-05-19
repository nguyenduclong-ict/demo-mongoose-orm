const path = require("path");
const { omit } = require("lodash");
const tsConfigPaths = require("tsconfig-paths");
const tsConfig = require("../server/tsconfig.json");
const isDev = process.env.NODE_ENV !== "production";
const baseUrl = !isDev ? "../.build/server" : "../server";

tsConfigPaths.register({
  baseUrl: path.join(__dirname, baseUrl),
  paths: omit(tsConfig.compilerOptions.paths, "~/*", "~/index"),
});
