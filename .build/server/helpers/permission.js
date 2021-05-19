"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPermission = void 0;
class CheckPermission {
    constructor(permissions, user) {
        this.permissions = [];
        this.user = null;
        this.permissions = permissions;
        this.user = user;
    }
    hasApiPermission(endpoint, method) {
        var _a;
        if ((_a = this.user) === null || _a === void 0 ? void 0 : _a.isAdmin)
            return true;
        return !!this.permissions.find((e) => e.entityType === "api" && e.endpoint === endpoint && e.method === method);
    }
    hasEntityPermission(entity, action) {
        var _a;
        if ((_a = this.user) === null || _a === void 0 ? void 0 : _a.isAdmin)
            return true;
        const permission = this.permissions.find((e) => e.entityType === "entity" && e.entity === entity.key && e.status);
        if (!permission)
            return false;
        return action ? permission.action === action : true;
    }
    hasPagePermission(pageName) {
        var _a;
        if ((_a = this.user) === null || _a === void 0 ? void 0 : _a.isAdmin)
            return true;
        return !!this.permissions.find((e) => e.entityType === "admin-page" && e.pageName === pageName);
    }
}
exports.CheckPermission = CheckPermission;
//# sourceMappingURL=permission.js.map