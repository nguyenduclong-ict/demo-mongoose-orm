<template>
  <EntityCrud :schema="schema" :custom-table-props="customTableProps" />
</template>

<script>
import EntityCrud from '~/components/CRUD/EntityCrud.vue'
import { ROUTES } from '~/config/constants/routes'
export default {
  components: { EntityCrud },
  asyncData({ store }) {
    const schema = store.state.schemas.Role
    return {
      schema,
    }
  },
  methods: {
    customTableProps(props, vm) {
      props.hooks = {
        afterFetch: (response, vm) => {
          console.log(response)
          vm.data.push(
            {
              id: 'anonymous',
              code: 'anonymous',
              name: 'Chưa đăng nhập',
            },
            {
              id: 'authenticated',
              code: 'authenticated',
              name: 'Đã đăng nhập',
            }
          )
        },
      }
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
              name: ROUTES.RolePermission,
              params: {
                code: row.code,
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

<style lang="scss" scoped></style>
