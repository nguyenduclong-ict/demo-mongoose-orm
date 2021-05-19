<template>
  <el-popover
    ref="popover"
    v-model="popoverVisible"
    trigger="click"
    :placement="placement + '-start'"
    popper-class="no-padding-x"
  >
    <li
      slot="reference"
      class="el-dropdown-menu__item flex justify-between filter-item-reference"
      :class="{
        'flex-row-reverse': placement === 'right',
        'is-active': popoverVisible,
      }"
      @click="handleReferenceClick"
    >
      <icon
        :name="
          placement === 'left' ? 'el-icon-arrow-left' : 'el-icon-arrow-right'
        "
        class="my-auto"
      ></icon>
      {{ label }}
    </li>

    <div class="filter-item-content min-w-s">
      <span class="text-base inline-block font-semibold px-12px mb-12px">
        Lọc theo {{ label }}
      </span>

      <span class="mb-12px px-12px w-full flex">
        <InputSearch
          v-if="hasSearch"
          size="small"
          search-on-focus
          @focus="handleSearch"
          @search="handleSearch"
        ></InputSearch>
      </span>

      <empty v-if="isNoData" v-loading="fetching"></empty>
      <template v-else>
        <el-scrollbar :wrap-style="{ maxHeight: '50vh' }">
          <el-checkbox-group
            v-model="selectedValues"
            v-loading="fetching"
            class="flex flex-col"
            :max="limit"
          >
            <el-checkbox
              v-for="(option, index) in listOptions"
              :key="option.id || index"
              class="px-12px el-dropdown-menu__item"
              style="margin-right: 0px; padding: 0 12px"
              :label="_.get(option, valueKey)"
            >
              {{ _.get(option, labelKey) }}
            </el-checkbox>
          </el-checkbox-group>
        </el-scrollbar>
        <el-pagination
          hide-on-single-page
          small
          layout="prev, pager, next"
          :page-size="payload.pageSize"
          :current-page="payload.page"
          :total="payload.total"
          @current-change="handlePageChange"
        ></el-pagination>
      </template>
    </div>
  </el-popover>
</template>

<script>
import { Utils, Lodash } from '~/utils'
import { BaseService } from '~/utils/service'
export default {
  props: {
    label: {
      type: String,
    },
    path: {
      type: String,
    },
    service: {
      type: BaseService,
    },
    defaultOptions: {
      type: Array,
      default: () => [],
    },
    defaultChecked: {
      validator: () => true,
    },
    placement: {
      type: String,
      default: 'right',
    },
    limit: {
      type: Number,
      default: 1,
    },
    labelKey: {
      type: String,
      default: 'name',
    },
    valueKey: {
      type: String,
      default: 'id',
    },
    method: {
      type: String,
      default: 'list',
    },
    payload: {
      type: Object,
      default: () => ({
        query: {},
        page: 1,
        pageSize: 10,
      }),
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      data: [],
      fetching: false,
      selectedValues: [],
      selectedOptions: [],
      oldSelectedValues: [],
      popoverVisible: false,
      hasSearch: false,
    }
  },

  computed: {
    listOptions() {
      const map = {}
      const data = []
      ;(this.defaultOptions || [])
        .concat(...this.selectedOptions, ...this.data)
        .forEach((item) =>
          Utils.pushIfNotExists(data, map, item, this.valueKey)
        )
      return data
    },
    value() {
      if (this.limit > 1) {
        return this.selectedValues
      }
      return this.selectedValues[0]
    },
    isEmpty() {
      return this.value
        ? this.limit > 1
          ? this.value.length === 0
          : !this.value
        : true
    },
    isNoData() {
      return this.listOptions.length === 0
    },
  },

  created() {
    this.mapDefaultValue()
    this.hasSearch = typeof this.payload.search === 'string'
    this.fetchData()
  },

  methods: {
    mapDefaultValue() {
      this.selectedValues = []
      if (this.defaultChecked) {
        if (this.limit > 1) {
          this.selectedValues = this.defaultChecked
        } else {
          this.selectedValues.push(this.defaultChecked)
        }
      }
      this.oldSelectedValues = [...this.selectedValues]
    },

    handleReferenceClick() {
      this.$emit('reference-click', this)
    },

    handlePageChange(page) {
      this.payload.page = page
      this.fetchData()
    },
    handleSearch(text) {
      this.payload.search = text
      this.fetchData()
    },
    async fetchData() {
      this.fetching = true
      try {
        // Lưu lại option đã chọn hiện tại
        this.selectedOptions = this.listOptions.filter((e) =>
          this.selectedValues.includes(e[this.valueKey])
        )
        let payload = Lodash.pick(this.payload, [
          'query',
          'page',
          'pageSize',
          'search',
          'exact',
          'populates',
          'sort',
          'select',
        ])
        payload = {
          page: 1,
          pageSize: 10,
          exact: true,
          ...payload,
        }
        const response = await this.service[this.method](this.$axios, payload)
        const {
          data = [],
          page = 1,
          pageSize = 10,
          total = 0,
          totalPages = 0,
        } = Utils.santizeResponse(response)

        this.data.splice(0, this.data.length, ...data)
        this.payload.page = page
        this.payload.pageSize = pageSize
        this.payload.total = total
        this.payload.totalPages = totalPages
        this.$nextTick(() => {
          this.$refs.popover?.updatePopper()
        })
      } catch (error) {
        console.log('DataTable fetch data error', error)
      }

      this.fetching = false
    },
  },
}
</script>

<style lang="scss">
.filter-item-reference {
  &.is-active {
    background-color: #ecf5ff;
    color: #66b1ff;
  }
}
.no-padding-x {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
