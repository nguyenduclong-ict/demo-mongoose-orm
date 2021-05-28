import { ROUTES } from './constants/routes'

console.log(ROUTES)

/** @type {import('~/typings').Route[]} */
export const routes = [
  {
    name: ROUTES.DASHBOARD,
    path: '/',
    meta: {
      title: 'Tổng quan',
      icon: 'el-icon-house',
      menu: true,
    },
    component: '~/pages/index.vue',
  },
  {
    name: ROUTES.LOGIN,
    path: '/login',
    component: '~/pages/login.vue',
    meta: {
      dontNeedPermission: true,
    },
  },
  {
    name: ROUTES.REGISTER,
    path: '/register',
    component: '~/pages/register.vue',
    meta: {
      dontNeedPermission: true,
    },
  },
  {
    name: 'SettingMenu',
    path: '/setting',
    meta: {
      icon: 'el-icon-setting',
      title: 'Cài đặt',
      menu: true,
    },
    component: '~/pages/setting/index.vue',
    children: [
      {
        name: ROUTES.AppearanceSetting,
        path: 'appearance',
        meta: {
          title: 'Hiển thị',
          menu: true,
        },
        component: '~/pages/setting/appearance.vue',
      },
    ],
  },
  {
    name: ROUTES.User,
    path: '/user',
    meta: {
      icon: 'el-icon-user',
      title: 'Người dùng',
      menu: true,
    },
    component: '~/pages/user/index.vue',
  },
  {
    name: ROUTES.UserPermission,
    path: '/user/:id/permission',
    meta: {
      title: 'Phân quyền người dùng',
    },
    component: '~/pages/user/user_permission.vue',
  },
  {
    name: ROUTES.Role,
    path: '/role',
    meta: {
      icon: 'el-icon-s-flag',
      title: 'Vai trò',
      menu: true,
    },
    component: '~/pages/role/index.vue',
  },
  {
    name: ROUTES.RolePermission,
    path: '/role/:code/permission',
    meta: {
      title: 'Phân quyền vai trò',
    },
    component: '~/pages/role/role_permission.vue',
  },
  {
    name: ROUTES.Entity,
    path: '/entities/:name',
    meta: {
      icon: 'el-icon-folder-opened',
      title: 'Đối tượng',
      menu: true,
    },
    component: '~/pages/entities/index.vue',
  },
  {
    name: ROUTES.Media,
    path: '/media',
    meta: {
      icon: 'el-icon-picture',
      title: 'Thư viện',
      menu: true,
    },
    component: '~/pages/media.vue',
  },
  {
    name: ROUTES.Redirect,
    path: '/redirect',
    component: '~/pages/redirect.vue',
    meta: {
      dontNeedPermission: true,
    },
  },
  {
    name: ROUTES.Init,
    path: '/init',
    component: '~/pages/init.vue',
    meta: {
      dontNeedPermission: true,
    },
  },
]
