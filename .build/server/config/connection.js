"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mongoose_orm_1 = require("mongoose-orm");
exports.connection = mongoose_orm_1.createConnection(process.env.MONGO_URI || {
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD,
    dbName: process.env.MONGO_DBNAME,
    host: process.env.MONGO_HOST || "localhost",
    port: process.env.MONGO_PORT || 27017,
    authSource: process.env.MONGO_AUTH_SOURCE,
});
//# sourceMappingURL=connection.js.map