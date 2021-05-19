<template>
  <EntityCrud
    :schema="schema"
    :custom-table-props="customTableProps"
  ></EntityCrud>
</template>

<script>
import EntityCrud from '~/components/CRUD/EntityCrud.vue'
import { ROUTES } from '~/config/constants/routes'
import PageMixin from '~/utils/mixin/page.mixin'
export default {
  components: {
    EntityCrud,
  },
  mixins: [PageMixin],
  asyncData({ store }) {
    const schema = store.state.schemas.User
    return {
      schema,
    }
  },

  methods: {
    customTableProps(props, vm) {
      const columnControl = props.columns.find(
        (column) => column.type === 'controls'
      )
      columnControl.controls.unshift({
        props: {
          icon: 'el-icon-key',
          type: 'warning',
          iconOnly: true,
          size: 'mini',
        },
        events: {
          click: ({ row }) => {
            this.$router.push({
              name: ROUTES.UserPermission,
              params: {
                id: row.id,
              },
            })
          },
        },
      })
      return props
    },
  },
}
</script>
