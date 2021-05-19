const path = require("path");
const express = require("express");
const serverBootstrap = require("../.build/server").default;

serverBootstrap().then(({ app, start }) => {
  app.use("/admin", express.static(path.join(process.cwd(), ".build/admin")));
  start();
});
