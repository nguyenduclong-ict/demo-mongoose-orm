<template>
  <DataTable v-if="created" v-bind="computedTableProps"></DataTable>
</template>

<script>
import DataTable from '~/components/Global/Table/DataTable.vue'
import { getService } from '~/config/services'
export default {
  components: { DataTable },
  props: {
    schema: Object,
    customTableProps: {
      type: Function,
    },
  },

  data() {
    return {
      created: false,
      tableProps: null,
    }
  },

  computed: {
    service() {
      return getService(this.schema.key, this.schema.endpoint)
    },
    isLarge() {
      return Object.keys(this.schema.schema).length > 10
    },
    computedTableProps() {
      if (this.customTableProps) {
        return this.customTableProps(this.tableProps, this) || this.tableProps
      }
      return this.tableProps
    },
  },

  created() {
    this.tableProps = this.$initTable({
      entitySchema: this.schema.schema,
      service: this.service,
      data: [],
      payload: this.schema.populates
        ? { populates: this.schema.populates }
        : {},
      columns: [
        {
          prop: 'id',
          label: 'ID',
          width: 250,
        },
      ]
        .concat(
          ...Object.keys(this.schema.schema)
            .filter((key) => !this.schema.schema[key]?.ui?.column?.hidden)
            .map((key) => {
              const field = this.schema.schema[key]
              return {
                label: field.name || key,
                prop: key,
                showOverflowTooltip: true,
                filter:
                  field.type === 'Number'
                    ? 'number'
                    : field.type === 'Date'
                    ? 'date'
                    : undefined,
                ...field.ui?.column,
              }
            })
        )
        .concat({
          type: 'controls',
          controls: ['view', 'edit', 'delete'],
          fixed: 'right',
        }),
      dialogs: {
        edit: {
          props: {
            // title: 'Chỉnh sửa ' + this.schema.name,
            width: this.isLarge ? '90%' : undefined,
            top: '5vh',
            'custom-class': 'crud-dialog',
          },
        },
        create: {
          props: {
            title: 'Thêm mới ' + this.schema.name,
            width: this.isLarge ? '90%' : undefined,
            top: '5vh',
            'custom-class': 'crud-dialog',
          },
        },
        view: {
          title: 'Chi tiết ' + this.schema.name,
          props: {},
        },
      },
    })

    this.created = true
  },
}
</script>

<style lang="scss">
.crud-dialog {
  @media screen and (max-width: 786px) {
    min-width: 90%;
  }
  .el-dialog__body {
    overflow: auto;
    max-height: calc(90vh - 128px);
  }
}
</style>
