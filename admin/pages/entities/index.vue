<template>
  <EntityCrud :schema="schema"></EntityCrud>
</template>

<script>
import EntityCrud from '~/components/CRUD/EntityCrud.vue'
import PageMixin from '~/utils/mixin/page.mixin'
export default {
  components: {
    EntityCrud,
  },
  mixins: [PageMixin],
  asyncData({ $axios, query, store, params, error }) {
    const schema = store.state.schemas[params.name]
    if (!schema) {
      return error({ statusCode: 404, message: 'Đối tượng không tồn tại' })
    }
    return {
      schema,
    }
  },

  computed: {
    title() {
      return this.schema.name || this.schema.key
    },
  },
}
</script>
