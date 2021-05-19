import { ConfigRepository } from "./Config";
import { MediaRepository } from "./Media";
import { PermissionRepository } from "./Permission";
import { RoleRepository } from "./Role";
import { UserRepository } from "./User";

export const configRepository = new ConfigRepository();
export const roleRepository = new RoleRepository();
export const userRepository = new UserRepository();
export const mediaRepository = new MediaRepository();
export const permissionRepository = new PermissionRepository();
