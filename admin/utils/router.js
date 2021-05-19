export function getFlatRoutes(nestedRoutes = [], result = []) {
  for (const route of nestedRoutes) {
    const { children, ...r } = route
    result.push(r)
    children?.length && getFlatRoutes(children, result)
  }
  return result
}

export function getSidebarItems(nestedRoutes = [], authUser) {
  const result = []
  for (const route of nestedRoutes) {
    const { component, ...r } = route
    if (r.meta?.menu && (!r.meta?.role || authUser.hasRole(r.meta.role))) {
      r.children?.length && (r.children = getSidebarItems(r.children, authUser))
      result.push(r)
    }
  }
  return result
}

export class AuthUser {
  constructor(user) {
    this.user = user
  }

  hasRole(roleCode) {
    if (!this.user) return false
    if (this.user.isAdmin) return true
    return this.checkRoleSchema(roleCode, this.user.roles)
  }

  checkRoleSchema(schema, roles = []) {
    const roleMap = new Map()
    roles.forEach((role) => roleMap.set(role.code, true))

    if (typeof schema === 'string') {
      return !!roleMap.get(schema)
    }

    if (Array.isArray(schema)) {
      return schema.some((roleCode) => !!roleMap.get(roleCode))
    }

    let passed = false

    if (schema.$or) {
      passed = schema.$or.some((item) => this.checkRoleSchema(item, roles))
    }

    if (!passed) return false

    if (schema.$and) {
      passed = schema.$and.every((item) => this.checkRoleSchema(item, roles))
    }

    return passed
  }
}
