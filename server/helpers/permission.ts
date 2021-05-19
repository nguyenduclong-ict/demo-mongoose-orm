import { Permission } from "@/entities/account/Permission";
import { User } from "@/entities/account/User";

export class CheckPermission {
  permissions: Permission[] = [];
  user: User = null;

  constructor(permissions: Permission[], user?: User) {
    this.permissions = permissions;
    this.user = user;
  }

  hasApiPermission(endpoint: string, method: string) {
    if (this.user?.isAdmin) return true;
    return !!this.permissions.find(
      (e) =>
        e.entityType === "api" && e.endpoint === endpoint && e.method === method
    );
  }

  hasEntityPermission(
    entity: any,
    action?: "create" | "read" | "update" | "delete"
  ) {
    if (this.user?.isAdmin) return true;
    const permission = this.permissions.find(
      (e) => e.entityType === "entity" && e.entity === entity.key && e.status
    );
    if (!permission) return false;
    return action ? permission.action === action : true;
  }

  hasPagePermission(pageName: string) {
    if (this.user?.isAdmin) return true;
    return !!this.permissions.find(
      (e) => e.entityType === "admin-page" && e.pageName === pageName
    );
  }
}
