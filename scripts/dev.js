const concurrently = require("concurrently");

concurrently([
  { command: "yarn dev:server", name: "server" },
  { command: "yarn dev:admin", name: "admin" },
]);
