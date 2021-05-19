import { Apis } from '~/config/apis'
import { ROUTES } from '~/config/constants/routes'

export default async function ({ $axios, store, redirect }, inject) {
  Apis.$axios = $axios
  console.log({ ...$axios })
  Object.keys(Apis).forEach((key) => {
    Apis[key].$axios = $axios
  })
  inject('api', Apis)

  const isInited = await $axios.$get('/auth/inited')
  if (!isInited) {
    window.onNuxtReady(() => {
      window.$nuxt.$router.push({ name: ROUTES.Init })
    })
  }
}
