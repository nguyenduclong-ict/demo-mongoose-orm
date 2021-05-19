import "@/helpers/mongoose";
import "@/helpers/utils";
import boxen from "boxen";
import "colors";
import cors from "cors";
import express, { Router, Express } from "express";
import fs from "fs";
import { createServer, Server } from "http";
import lodash from "lodash";
import morgan from "morgan";
import path from "path";
import { UPLOAD_PATH } from "./config/env";
import "./entities";
import { initRequestMeta } from "./helpers/api";
import { HandleRequestError } from "./helpers/error";
import { Gateway } from "./helpers/gateway";
lodash.set(global, "_", lodash);

const isDev = process.env.NODE_ENV !== "production";

export default async function serverBootstrap(app?: Express) {
  app = app || express();
  const server = createServer(app);

  app.use(morgan("dev"));
  app.use(express.static(process.env.STATIC_PATH));

  // Api
  const api = Router();
  const gateway = new Gateway(api, "/api");
  app.use("/api", api);
  api.use(express.json());
  api.use(initRequestMeta);
  api.use(cors());

  if (!fs.existsSync(UPLOAD_PATH)) {
    console.log("Create upload path".blue, UPLOAD_PATH);
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
  }
  await gateway.registerRoutes(path.join(__dirname, "api"), {
    expandDirectories: {
      extensions: ["ts", "js"],
      files: ["*.router.ts", "*.router.js"],
    },
  });

  api.use(HandleRequestError);
  return { app, server, start: start(app, server) };
}

export const start = (app: Express, server: Server) => {
  return function () {
    const port = Number(
      process.env.PORT || process.env.SERVER_URL?.split(":").pop() || 5000
    );
    server.listen(port, () => {
      if (process.env.NODE_ENV === "production") {
        console.log(
          boxen(
            [
              "Server start success".green,
              "",
              "api:   " + `${process.env.SERVER_URL}/api`.yellow.bold,
              "admin: " + `${process.env.SERVER_URL}/admin`.yellow.bold,
            ].join("\n"),
            {
              borderColor: "green",
              padding: 1,
            }
          )
        );
      } else {
        console.log(
          boxen(
            [
              "Server start success".green,
              "",
              "api:   " + `${process.env.SERVER_URL}/api`.yellow.bold,
              "admin: " +
                `http://localhost:${process.env.ADMIN_PORT}`.yellow.bold,
            ].join("\n"),
            {
              borderColor: "green",
              padding: 1,
            }
          )
        );
      }
    });
  };
};

if (isDev) {
  serverBootstrap().then(({ start }) => {
    start();
  });
}
