import { FIXED_HEADER } from '~/config/constants'
import { ROUTES } from '~/config/constants/routes'
import { routes } from '~/config/router'
import theme from '~/config/theme'
import { AuthUser } from '~/utils/router'
import { parseBool, replace } from '~/utils/utils'
import { CheckPermission } from '~/utils/permission'

export const state = () => ({
  sidebar: {
    isCollapsed: window.innerWidth < 640,
  },
  fixedHeader: parseBool(localStorage.getItem(FIXED_HEADER) ?? true),
  theme,
  schemas: {},
  permissions: [],
  page: {},
})

export const mutations = {
  TOGGLE_MENU(state, value) {
    value = value ?? !state.sidebar.isCollapsed
    state.sidebar.isCollapsed = value
  },
  TOGGLE_FIXED_HEADER(state, value) {
    state.fixedHeader = value ?? !state.fixedHeader
  },
  SET_SCHEMAS(state, value) {
    state.schemas = value
  },
  SET_PERMISSIONS(state, value) {
    state.permissions = value
  },
  SET_PAGE(state, value) {
    state.page = value
  },
}

export const getters = {
  authUser(state, getters, rootState) {
    return new AuthUser(rootState.auth.user)
  },
  sidebarItems(state, getters, rootState) {
    const permissions = state.permissions
    const checkPermission = new CheckPermission(
      permissions,
      rootState.auth.user
    )
    const filterMenu = (items) => {
      const result = []
      items.forEach((item) => {
        if (
          item.meta?.menu &&
          (item.meta?.dontNeedPermission ||
            (!item.meta?.dontNeedPermission &&
              checkPermission.hasPagePermission(item.name)))
        ) {
          let children
          if (item.children && item.children.length) {
            children = filterMenu(item.children)
          }
          result.push({
            ...item,
            children,
          })
        }
      })
      return result
    }
    const items = [...filterMenu(routes)]
    let entityMenu = items.find((item) => item.name === ROUTES.Entity)
    if (entityMenu) {
      entityMenu = { ...entityMenu }
      entityMenu.children = entityMenu.children || []
      Object.keys(state.schemas).forEach((key) => {
        const entity = state.schemas[key]
        if (checkPermission.hasEntityPermission(entity, 'read')) {
          entityMenu.children.push({
            name: 'Entity' + entity.key,
            route: {
              name: ROUTES.Entity,
              params: {
                name: entity.key,
              },
            },
            meta: {
              menu: true,
              title: entity.name,
            },
          })
        }
      })
      replace(items, entityMenu, (e) => e.name === ROUTES.Entity)
    }
    return items
  },
}
