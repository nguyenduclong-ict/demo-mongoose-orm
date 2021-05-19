<template>
  <CustomElSelect
    ref="select"
    v-model="_value"
    filterable
    :clearable="clearable"
    :filter-method="filterMethod"
    :multiple="limit > 1"
    :multiple-limit="limit"
    :loading="fetching"
    :allow-create="!!crud.create"
    :default-first-option="!!crud.create"
    v-bind="setting"
    @change="handleChange"
    @create="handleCreate"
  >
    <SelectEntityOption
      v-for="(item, index) in listOptions"
      :key="_.get(item, valueKey) || item.id || index"
      :value="_.get(item, valueKey)"
      :label="_.get(item, labelKey)"
    >
      <slot name="item" :item="item" :context="this"></slot>
    </SelectEntityOption>
  </CustomElSelect>
</template>
<script>
import SelectEntityOption from './SelectEntityOption'
import CustomElSelect from './CustomElSelect'
import { BaseService } from '~/utils/service'
import { Lodash, Utils } from '~/utils'

export default {
  name: 'SelectEntity',
  components: { SelectEntityOption, CustomElSelect },
  props: {
    value: {
      type: [String, Number, Array, Object],
    },
    service: {
      type: BaseService,
    },
    defaultOptions: {
      type: Array,
      default: () => [],
    },
    method: {
      type: String,
      default: 'list',
    },
    payload: {
      type: Object,
      default: () => ({
        query: {},
        search: '',
        page: 1,
        pageSize: 10,
        total: 0,
        exact: true,
      }),
    },
    selectProps: {
      type: Object,
      default: () => ({}),
    },
    valueKey: {
      type: String,
      default: 'id',
    },
    labelKey: {
      type: String,
      default: 'name',
    },
    limit: {
      type: Number,
      default: 1,
    },
    crud: {
      type: Object,
      default: () => ({
        create: false,
        edit: false,
        delete: false,
      }),
    },
    transform: {
      type: [Object, String],
      validator(value) {
        console.log(value)
      },
    },
    filterDataMethod: {
      type: Function,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      data: [],
      fetching: false,
      selectedValues: [],
      selectedOptions: [],
      oldSelectedValues: [],
    }
  },

  computed: {
    _value: {
      get() {
        if (this.transform?.get) {
          return this.transform.get(this.value, this)
        }
        return this.value
      },
      set(v) {
        if (this.transform?.set) {
          return this.$emit('input', this.transform.set(v, this))
        }
        this.$emit('input', v || null)
      },
    },
    listOptions() {
      const map = {}
      let data = []
      ;(this.defaultOptions || [])
        .concat(...this.selectedOptions, ...this.data)
        .forEach((item) =>
          Utils.pushIfNotExists(data, map, item, this.valueKey)
        )
      if (this.filterDataMethod) data = this.filterDataMethod(data, this)
      return data
    },
    multiple() {
      return this.limit > 1
    },
    setting() {
      const setting = {}

      return Object.assign(setting, this.selectProps)
    },
  },

  watch: {
    _value: {
      handler(value) {
        this.selectedValues.splice(0)
        if (!value) return
        value = Array.isArray(value) ? value : [value]
        const map = {}
        value.forEach((item) => {
          const find = this.listOptions.find(
            (options) => Lodash.get(options, this.valueKey) === item
          )
          if (find) {
            Utils.pushIfNotExists(this.selectedValues, map, find, 'id')
          }
        })
      },
    },
  },

  created() {
    this.mapDefaultValue()
    this.fetchData()
  },

  methods: {
    async handleCreate(text, option) {
      try {
        console.log('create', text)
        const service = this.crud.create.service || this.service
        const method = this.crud.create.method || 'create'
        const api = service[method]
        const payload = {
          data: {},
          ...(this.crud.create.payload || {}),
        }
        Lodash.set(payload.data, this.crud.create.field || 'name', text)
        const response = await api.call(service, this.$axios, payload)
        this.data.unshift(response)
        this.$nextTick(() => {
          this.$refs.select.selectOptionByValue(response.id)
        })
      } catch (error) {
        console.log('create new item error')
      }
    },

    handleChange(value) {
      this.$emit('change', value)
    },

    filterMethod(text) {
      this.payload.search = text
      this.fetchData()
    },

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
    async fetchData() {
      if (!this.service) {
        console.warn('select-entity no service')
        return
      }
      this.fetching = true
      try {
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
        } = Utils.santizeResponse(response)

        this.data.splice(0, this.data.length, ...data)
        this.payload.page = page
        this.payload.pageSize = pageSize
        this.payload.total = total
      } catch (error) {
        console.log('DataTable fetch data error', error)
      }
      this.fetching = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
