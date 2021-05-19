import { ENDPOINTS } from '~/config/constants/endpoints'
import { ApiService, BaseService } from '~/utils/service'

export type GenerateServices = { [K in keyof typeof ENDPOINTS]: BaseService }
export type GenerateApiServices = { [K in keyof typeof ENDPOINTS]: ApiService }

// Router
export type RoleSchema =
  | string
  | {
      $and: RoleSchema[]
      $or: RoleSchema[]
    }

export interface Route {
  name: string
  path: string
  meta: {
    title: string
    icon: string
    menu: boolean
    role: RoleSchema | RoleSchemas[]
    dontNeedPermission?: boolean
  }
  component: any
  children: Route[]
}
