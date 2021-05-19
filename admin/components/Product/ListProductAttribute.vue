<template>
  <DataTable v-bind="tableConfig">
    <el-table-column slot="column-values" label="Giá trị">
      <template #default="{ row }">
        <el-tag
          v-for="v in row.values"
          :key="v"
          size="small"
          effect="dark"
          class="mr-1"
        >
          {{ v }}
        </el-tag>
      </template>
    </el-table-column>
  </DataTable>
</template>

<script>
export default {
  data() {
    return {
      tableConfig: this.$initTable({
        service: this.$services.ProductAttribute,
        columns: [
          {
            label: 'Tên',
            prop: 'name',
          },
          {
            type: 'slot',
            prop: 'values',
          },
          {
            type: 'controls',
            width: '128px',
            controls: ['edit'],
          },
        ],
        entitySchema: this.$store.state.schemas.ProductAttribute.schema,
        dialogs: {
          create: {
            props: {
              title: 'Thêm mới thuộc tính',
              appendToBody: true,
            },
          },
          edit: {
            props: {
              title: 'Chỉnh sửa thuộc tính',
              appendToBody: true,
            },
          },
        },
      }),
    }
  },
}
</script>

<style></style>
