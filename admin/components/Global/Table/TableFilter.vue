<template>
  <el-popover ref="popover" trigger="click">
    <el-button
      slot="reference"
      icon-only
      icon="filter"
      type="primary"
      size="small"
    ></el-button>

    <div class="flex justify-between max-w-md">
      <el-button
        type="text"
        size="small"
        icon="el-icon-close"
        @click="handleClear"
      >
        Clear
      </el-button>
      <span class="ml-4 flex">
        <el-button size="small" @click="handleCancel">Hủy</el-button>
        <el-button size="small" type="primary" @click="handleApply">
          Áp dụng
        </el-button>
      </span>
    </div>

    <div
      class="list-filter-items"
      :style="{ margin: '0 -12px', marginTop: '12px' }"
    >
      <FilterItem
        v-for="item in items"
        ref="filterItems"
        :key="item.path"
        v-bind="item"
        @reference-click="handleFilterClick"
      ></FilterItem>
    </div>
  </el-popover>
</template>

<script>
export default {
  name: 'TableFilter',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {}
  },

  methods: {
    handleClear() {
      const data = {}
      const filterItems = this.$refs.filterItems
      filterItems.forEach((item) => {
        item.mapDefaultValue()
        data[item.path] = item
      })
      this.close()
      this.$emit('filter', data)
    },

    handleCancel() {
      const filterItems = this.$refs.filterItems
      filterItems.forEach((item) => {
        item.selectedValues = item.oldSelectedValues
      })
      this.$refs.popover.doClose()
    },

    handleApply() {
      const data = {}
      const filterItems = this.$refs.filterItems
      filterItems.forEach((item) => {
        item.oldSelectedValues = [...item.selectedValues]
        data[item.path] = item
      })
      this.close()
      this.$emit('filter', data)
    },

    handleFilterClick(filterRef) {
      if (!filterRef.popoverVisible) {
        this.$refs.filterItems.forEach((item) => {
          if (item !== filterRef) item.$refs.popover.doClose()
        })
      }
    },

    close() {
      this.$refs.filterItems.forEach((item) => {
        item.$refs.popover.doClose()
      })
      this.$refs.popover.doClose()
    },
  },
}
</script>

<style lang="scss" scoped></style>
