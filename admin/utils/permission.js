export class CheckPermission {
  permissions = []
  user = null

  constructor(permissions, user) {
    this.permissions = permissions
    this.user = user
  }

  hasApiPermission(endpoint, method) {
    if (this.user?.isAdmin) return true
    return !!this.permissions.find(
      (e) =>
        e.entityType === 'api' &&
        e.endpoint === endpoint &&
        e.method === method &&
        e.status === true
    )
  }

  hasEntityPermission(entity, action) {
    if (this.user?.isAdmin) return true
    const permission = this.permissions.find(
      (e) =>
        e.entityType === 'entity' &&
        e.entity === entity.key &&
        e.status === true
    )
    if (!permission) return false
    return action ? permission.action === action : true
  }

  hasPagePermission(pageName) {
    if (this.user?.isAdmin) return true
    return !!this.permissions.find(
      (e) =>
        e.entityType === 'admin-page' &&
        e.pageName === pageName &&
        e.status === true
    )
  }
}
