"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionRepository = exports.mediaRepository = exports.userRepository = exports.roleRepository = exports.configRepository = void 0;
const Config_1 = require("./Config");
const Media_1 = require("./Media");
const Permission_1 = require("./Permission");
const Role_1 = require("./Role");
const User_1 = require("./User");
exports.configRepository = new Config_1.ConfigRepository();
exports.roleRepository = new Role_1.RoleRepository();
exports.userRepository = new User_1.UserRepository();
exports.mediaRepository = new Media_1.MediaRepository();
exports.permissionRepository = new Permission_1.PermissionRepository();
//# sourceMappingURL=index.js.map