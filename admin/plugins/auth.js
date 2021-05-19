export default async function ({ $axios, store, $auth }) {
  const permissions = await $axios.$get('/auth/permissions')
  console.log(permissions)
  store.commit('SET_PERMISSIONS', permissions)
  if ($auth.loggedIn) {
    const schemas = await $axios.$get('/admin/schemas')
    store.commit('SET_SCHEMAS', schemas)
  }
}
