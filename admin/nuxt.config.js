import { routes as appRoutes } from './config/router'
import { pick } from './utils/lodash'
const isDev = process.env.NODE_ENV !== 'production'
const port = isDev
  ? Number(process.env.ADMIN_PORT) || Number(process.env.PORT || 3000) + 1
  : undefined
// eslint-disable-next-line
module.exports = {
  env: {
    API_URL: process.env.API_URL,
    SERVER_URL: process.env.SERVER_URL,
  },
  srcDir: 'admin',
  buildDir: 'admin/.nuxt',
  generate: {
    dir: '.build/admin',
  },

  dir: {
    pages: 'app-pages',
  },

  // target: 'static',
  ssr: false,
  telemetry: false,

  layoutTransition: {
    name: 'fade-transform',
  },
  pageTransition: {
    name: 'fade-transform',
  },

  head: {
    title: 'shop-admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~/assets/scss/global.scss',
    '~/assets/scss/transition.scss',
  ],

  plugins: [
    { src: '~/plugins/element-ui' },
    { src: '~/plugins/mixin', mode: 'client' },
    { src: '~/plugins/bootstrap', mode: 'client' },
  ],

  components: [
    { path: '~/components/Global', ignore: ['DynamicForm/form.js'] },
    '~/components/Global/Address',
    '~/components/Global/Icons',
    '~/components/Global/Input',
    '~/components/Global/Select',
    '~/components/Global/Table',
  ],

  buildModules: ['@nuxtjs/tailwindcss'],

  router: {
    base: isDev ? '/' : '/admin',
    extendRoutes(routes) {
      routes.splice(0)
      routes.push(...appRoutes)
    },
    middleware: ['auth', 'permission'],
  },

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/pwa',
    '@nuxtjs/svg-sprite',
  ],

  svgSprite: {
    input: '~/components/Global/Icons/svg-sprite',
    output: '~/components/Global/Icons/svg-sprite-gen',
    elementClass: 'svg-icon',
  },

  axios: {
    progress: false,
    prefix: '/api',
  },

  auth: {
    localStorage: false,
    cookie: {
      options: {
        expires: 30,
      },
    },
    strategies: {
      local: {
        user: {
          property: '',
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/auth/me', method: 'get' },
        },
      },
    },
    redirect: {
      login: '/redirect',
      logout: '/redirect',
      callback: '/redirect',
      home: '/',
    },
    plugins: ['~/plugins/auth'],
  },

  build: {
    transpile: [/^element-ui/],
  },

  server: {
    port,
  },
}
