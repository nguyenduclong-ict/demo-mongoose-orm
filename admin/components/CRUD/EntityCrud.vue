<template>
  <DataTable v-if="created" v-bind="computedTableProps"></DataTable>
</template>

<script>
import DataTable from '~/components/Global/Table/DataTable.vue'
import { getService } from '~/config/services'
export default {
  components: { DataTable },
  props: {
    entity: Object,
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
      return getService(this.entity.key, this.entity.endpoint)
    },
    isLarge() {
      return Object.keys(this.entity.fields).length > 10
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
      entity: this.entity,
      service: this.service,
      data: [],
      payload: this.entity.populates
        ? { populates: this.entity.populates }
        : {},
      columns: [
        {
          prop: 'id',
          label: 'ID',
          width: 250,
        },
      ]
        .concat(
          ...Object.keys(this.entity.fields)
            .filter((key) => !this.entity.fields[key]?.column?.hidden)
            .map((key) => {
              const field = this.entity.fields[key]
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
                ...field.column,
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
            // title: 'Chỉnh sửa ' + this.entity.name,
            width: this.isLarge ? '90%' : undefined,
            top: '5vh',
            'custom-class': 'crud-dialog',
          },
        },
        create: {
          props: {
            title: 'Thêm mới ' + this.entity.name,
            width: this.isLarge ? '90%' : undefined,
            top: '5vh',
            'custom-class': 'crud-dialog',
          },
        },
        view: {
          title: 'Chi tiết ' + this.entity.name,
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
