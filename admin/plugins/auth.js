export default async function ({ $axios, store, $auth }) {
  const permissions = await $axios.$get('/auth/permissions')
  console.log(permissions)
  store.commit('SET_PERMISSIONS', permissions)
  if ($auth.loggedIn) {
    const entities = await $axios.$get('/admin/entities')
    Object.keys(entities).forEach((k) => {
      const entity = entities[k]
      Object.keys(entity.fields).forEach((key) => {
        const field = entity.fields[key]
        field.rules.forEach((rule) => {
          if (rule.patternObject) {
            rule.pattern = new RegExp(
              rule.patternObject[0],
              rule.patternObject[1]
            )
          }
        })
      })
    })
    store.commit('SET_ENTITIES', entities)
  }
}
