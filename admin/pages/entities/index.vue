<template>
  <EntityCrud :entity="entity"></EntityCrud>
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
    const entity = store.state.entities[params.name]
    if (!entity) {
      return error({ statusCode: 404, message: 'Đối tượng không tồn tại' })
    }
    return {
      entity,
    }
  },

  computed: {
    title() {
      return this.entity.name || this.entity.key
    },
  },
}
</script>
