<template>
  <div class="data-table w-full">
    <div class="flex flex-row table-controls mb-2">
      <div class="left flex">
        <InputSearch
          v-if="options.search"
          class="max-w-md"
          size="small"
          @search="handleSearch"
        ></InputSearch>
        <FilterDate
          v-for="(filterDate, index) in filterDates"
          :key="index"
          v-bind="filterDate"
          @filterDate="handleFilterDate($event, filterDate)"
        ></FilterDate>
        <TableFilter
          v-if="options.filter"
          v-bind="options.filter"
          @filter="handleFilter"
        />
      </div>
      <div class="flex-1"><slot name="controls"></slot></div>
      <div class="right flex">
        <el-button
          v-if="dialogs.create"
          template="create"
          @click="handleShowCreate"
        ></el-button>
      </div>
    </div>
    <!-- Filter -->
    <el-table
      v-loading="fetching"
      :data="data"
      v-bind="tableProps"
      style="width: 100%"
      v-on="tableEvents"
    >
      <template v-for="(column, index) in columns">
        <el-table-column
          v-if="!column.type"
          :key="column.key || column.prop || index"
          v-bind="column"
          :render-header="renderHeader"
        >
          <template #default="{ row }">
            <div v-if="column.isImage" style="width: 48px; height: 48px">
              <img
                v-if="getImageSrc(_.get(row, column.prop))"
                :src="getImageSrc(_.get(row, column.prop))"
                class="column-image"
                @click="
                  showImage(_.get(row, column.prop), [_.get(row, column.prop)])
                "
              />
            </div>
            <div v-else-if="column.isImages" class="column-images">
              <img
                v-for="(img, id) in _.get(row, column.prop)"
                :key="id"
                :src="getImageSrc(img)"
                @click="showImage(img, _.get(row, column.prop))"
              />
            </div>
            <span v-else v-html="getCellText(row, column)"></span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="['selection', 'index', 'expand'].includes(column.type)"
          :key="column.key || index"
          v-bind="column"
        ></el-table-column>
        <el-table-column
          v-if="column.type === 'component'"
          :key="column.key || index"
          v-bind="column"
        >
          <template #default="props">
            <component
              :is="
                typeof column.component === 'string'
                  ? column.component
                  : _.get(column, 'component.name')
              "
              v-bind="getComponentProps(props, column)"
              v-on="_.get(column, 'component.events')"
            >
              {{ getComponentText(props, column) }}
            </component>
          </template>
        </el-table-column>
        <el-table-column
          v-if="column.type === 'controls'"
          :key="column.key || index"
          :label="column.label || 'Thao tác'"
          align="right"
          :width="column.width || _.get(column, 'controls.length', 0) * 48"
          v-bind="column"
        >
          <template #default="props">
            <el-button
              v-for="control in column.controls"
              :key="getControlKey(control)"
              :template="'table_' + getControlKey(control)"
              v-bind="control.props || {}"
              @click="handleControlClick(control, props, column)"
            ></el-button>
          </template>
        </el-table-column>
        <slot
          v-if="column.type === 'slot'"
          :name="`column-${column.prop}`"
          v-bind="{ column, ctx: this }"
        ></slot>
      </template>
    </el-table>

    <el-pagination
      v-if="options.pagination"
      class="mt-2"
      :current-page="payload.page"
      :page-sizes="[10, 20, 50, 100, 200]"
      :page-size="payload.pageSize"
      :total="payload.total"
      layout="total, sizes, ->, jumper,  prev, pager, next"
      background
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
    ></el-pagination>

    <el-dialog
      v-if="dialogs.view"
      ref="dialogView"
      width=""
      custom-class="table-dialog-view"
      :title="
        _.get(dialogs, 'view.props.title') ||
        'Chi tiết ' +
          (_.get(selectedRow, 'name', '') ||
            _.get(selectedRow, 'title', '') ||
            _.get(selectedRow, 'id', ''))
      "
      :visible.sync="isShowView"
      v-bind="dialogs.view.props"
    >
      <slot
        name="form-view"
        :control="controlSetting"
        :context="this"
        :row="selectedRow"
      >
        <DetailEntity
          v-if="selectedRow"
          :schema="entity"
          v-bind="dialogs.view"
          :entity="selectedRow"
        />
      </slot>
    </el-dialog>

    <el-dialog
      v-if="dialogs.edit"
      ref="dialogEdit"
      :title="
        _.get(dialogs, 'edit.props.title') ||
        'Chỉnh sửa ' +
          (_.get(selectedRow, 'name', '') ||
            _.get(selectedRow, 'title', '') ||
            _.get(selectedRow, 'id', ''))
      "
      :visible.sync="isShowEdit"
      v-bind="dialogs.edit.props"
      @close="selectedRow = null"
    >
      <slot
        name="form-edit"
        :control="controlSetting"
        :context="this"
        :row="selectedRow"
      >
        <DynamicForm
          v-if="selectedRow && mode === 'edit'"
          ref="formEdit"
          :data="selectedRow"
          v-bind="dialogs.edit.form"
          :fields="getUpdateFields()"
        ></DynamicForm>
      </slot>
      <span slot="footer">
        <el-button
          template="cancel"
          @click="handleDialogAction('cancel', mode)"
        ></el-button>
        <el-button
          template="save"
          @click="handleDialogAction('save', mode)"
        ></el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="dialogs.create"
      ref="dialogCreate"
      :title="_.get(dialogs, 'create.props.title', 'Thêm mới')"
      :visible.sync="isShowCreate"
      v-bind="dialogs.create.props"
      @close="formCreate = null"
    >
      <slot
        name="form-create"
        :control="controlSetting"
        :context="this"
        :row="formCreate"
      >
        <DynamicForm
          v-if="dialogs.create && formCreate"
          ref="formCreate"
          :data="formCreate"
          v-bind="dialogs.create.form"
          :fields="getCreateFields()"
        ></DynamicForm>
      </slot>
      <span slot="footer">
        <el-button
          template="cancel"
          @click="handleDialogAction('cancel')"
        ></el-button>
        <el-button
          template="save"
          @click="handleDialogAction('save')"
        ></el-button>
      </span>
    </el-dialog>

    <el-image
      ref="elImage"
      style="width: 0px; height: 0px"
      :src="getImageSrc(selectedImage)"
      :preview-src-list="listImages"
    ></el-image>
  </div>
</template>

<script>
import TableFilter from './TableFilter'
import FilterDate from './FilterDate.vue'
import DetailEntity from './DetailEntity'
import { getFieldConfig } from '~/components/Global/DynamicForm/form'
import { BaseService } from '~/utils/service'
import { Lodash, Utils } from '~/utils'
import { cloneDeep, defaultsDeep, get } from '~/utils/lodash'

export default {
  components: { TableFilter, FilterDate, DetailEntity },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    service: {
      type: BaseService,
    },
    method: {
      type: String,
      default: 'list',
    },
    options: {
      type: Object,
      default: () => ({
        search: true,
        filter: false,
        pagination: true,
      }),
    },
    dialogs: {
      type: Object,
      default: () => ({
        view: {
          title: 'Chi tiết',
        },
        edit: {
          title: 'Chỉnh sửa',
        },
      }),
    },
    /**
     * @type {[ { field, default, convert: function(value) => query, dateProps: object } ]}
     */
    filterDates: {
      type: Array,
      default: () => [],
    },
    tableProps: {
      type: Object,
      default: () => ({}),
    },
    tableEvents: {
      type: Object,
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
    entity: Object,
    hooks: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      fetching: false,
      selectedRow: null,
      mode: null,
      controlSetting: null,
      isShowView: false,
      isShowEdit: false,
      isShowCreate: false,
      formCreate: null,
      selectedImage: null,
      listImages: [],
    }
  },

  created() {
    this.columns.forEach((column) => {
      if (column.filter && !column.formatter) {
        const filterName =
          typeof column.filter !== 'string' ? column.filter.name : column.filter
        const filterArgs =
          typeof column.filter !== 'string' ? column.filter.args || [] : []
        column.formatter = (row, column, cellValue, index) =>
          this.$options.filters[filterName](cellValue, ...filterArgs)
      }
    })

    this.fetchData()
  },

  methods: {
    showImage(img, images) {
      this.selectedImage = img
      this.listImages = images ? images.map((e) => this.getImageSrc(e)) : []
      this.listImages = Array.isArray(this.listImages)
        ? this.listImages
        : [this.listImages]
      setTimeout(() => {
        this.$refs.elImage.clickHandler()
      })
    },
    renderHeader(h, { column, $index }) {
      if (!column.minWidth || !column.width) {
        column.minWidth = Math.max(80, column.label?.length * 14)
      }
      return column.label
    },
    getUpdateFields() {
      if (this.dialogs.edit?.form?.fields)
        return this.dialogs.edit?.form?.fields
      if (this.entity) {
        return Object.keys(this.entity.fields).map((key) => {
          const field = this.entity.fields[key]
          const c = getFieldConfig(field, this.$store.state.entities, key)
          return defaultsDeep(c, field)
        })
      }
      return []
    },
    getCreateFields() {
      if (this.dialogs.create?.form?.fields)
        return this.dialogs.create?.form?.fields
      if (this.entity) {
        return Object.keys(this.entity.fields).map((key) => {
          const field = this.entity.fields[key]
          const c = getFieldConfig(field, this.$store.state.entities, key)
          return defaultsDeep(c, field)
        })
      }
      return []
    },
    getComponentProps(props, column) {
      if (!column.component.props) {
        return {}
      }
      if (typeof column.component.props === 'function') {
        return column.component.props(props, this)
      }
      return column.component.props
    },
    getComponentText(props, column) {
      let text
      if (!column.component.$text) {
        text = ''
      } else if (typeof column.component.$text === 'function') {
        return column.component.$text(props, this)
      } else {
        text = column.component.$text
      }
      if (typeof text === 'object') text = JSON.stringify(text, null, 2)
      return text
    },
    getCellText(row, column) {
      const field = this.entity?.[column.prop]
      if (field?.props?.labelKey) {
        return get(row, [column.prop, field?.props?.labelKey].join('.'))
      } else {
        return get(row, column.prop)
      }
    },
    async handleDialogAction(action) {
      try {
        if (this.mode === 'edit' && this.controlSetting[action]) {
          this.controlSetting[action]({
            form: this.$refs.formEdit.form,
            dynamicForm: this.$refs.formEdit,
            context: this,
          })
          return
        }
        if (this.mode === 'edit') {
          if (action === 'cancel') return (this.isShowEdit = false)
          if (action === 'save') {
            if (!(await this.$refs.formEdit.validate())) return
            const service = this.dialogs?.edit?.service || this.service
            const method = this.dialogs?.edit?.method || 'updateOne'
            const api = service[method].bind(service)
            const form = this.$refs.formEdit.form

            const response = await api(this.$axios, {
              data: form,
              ...(this.dialogs?.edit?.payload || {}),
            })
            this.updateItem(response)
            this.$message.success('Cập nhật thành công')
            this.isShowEdit = false
          }
          return
        }

        if (this.mode === 'create') {
          if (action === 'cancel') return (this.isShowCreate = false)
          if (action === 'save') {
            if (!(await this.$refs.formCreate.validate())) return
            const service = this.dialogs?.create?.service || this.service
            const method = this.dialogs?.create?.method || 'create'
            const api = service[method].bind(service)
            const form = this.$refs.formCreate.form

            const response = await api(this.$axios, {
              data: form,
              ...(this.dialogs?.create?.payload || {}),
            })
            this.addItem(response)
            this.$message.success('Tạo thành công!')
            this.isShowCreate = false
          }
        }
      } catch (error) {
        console.log('handleDialogAction Error', error)
        this.$message.error(this.getErrorMessage(error))
      }
    },
    handleShowCreate() {
      if (this.dialogs.create.onShow) {
        this.dialogs.create.onShow()
        return
      }
      this.form = null
      this.$nextTick(() => {
        const form = {}
        this.getCreateFields().forEach((field) => {
          form[field.prop] = field.default
        })
        this.mode = 'create'
        this.controlSetting = this.dialogs.create
        this.formCreate = form
        this.isShowCreate = true
      })
    },
    getControlKey(control) {
      if (typeof control === 'string') return control
      return control?.key || control?.text
    },
    handleControlClick(control, props, column) {
      const { row } = props
      const controlSetting = column.events?.[this.getControlKey(control)] || {}
      this.controlSetting = controlSetting

      if (controlSetting?.click) {
        controlSetting?.click({
          control,
          props,
          column,
          row,
          context: this,
        })
        return
      }

      if (control?.events?.click) {
        control?.events?.click({
          control,
          props,
          column,
          row,
          context: this,
        })
        return
      }

      switch (control) {
        case 'view':
          this.mode = null
          this.selectedRow = null
          this.$nextTick(() => {
            this.mode = 'view'
            this.selectedRow = row
            this.isShowView = true
          })
          break
        case 'edit':
          this.mode = null
          this.$nextTick(() => {
            this.mode = 'edit'
            this.selectedRow = cloneDeep(row)
            this.isShowEdit = true
          })
          break
        case 'delete':
          this.$confirm(controlSetting.message || 'Xác nhận xóa dữ liệu này?', {
            title: 'Xóa dữ liệu',
            type: 'warning',
          }).then(async () => {
            try {
              if (this.service) {
                await (controlSetting.service || this.service)[
                  controlSetting.method || 'delete'
                ](this.$axios, {
                  query: { _id: row.id },
                })
              }
              this.removeItem(row)
              this.$message('Xóa thành công!')
            } catch (error) {
              console.log('delete row error', error)
            }
          })
          break

        default:
          break
      }
    },

    handleSearch(text) {
      this.payload.search = text
      this.payload.page = 1
      this.fetchData()
    },

    handleFilterDate(query, filterItem) {
      Object.keys(query).forEach((key) => {
        if (query[key]) Lodash.set(this.payload.query, key, query[key])
        else {
          Lodash.customUnset(this.payload.query, key)
        }
      })
      this.payload.page = 1
      this.fetchData()
    },

    handlePageSizeChange(pageSize) {
      this.payload.page = Math.ceil(
        (this.payload.pageSize / pageSize) * this.payload.page
      )
      this.payload.pageSize = pageSize
      this.fetchData()
    },

    handlePageChange(page) {
      this.payload.page = page
      this.fetchData()
    },

    //
    addItem(item) {
      if (this.tableProps?.rowKey) {
        const parentField = this.tableProps.parentField || 'parent'
        const childrenField = this.tableProps?.treeProps?.children || 'children'
        // find recusive in list data
        const parent = Utils.findRecusive(
          this.data,
          (e) => e.id === item[parentField],
          childrenField
        )
        const list = parent?.[childrenField] || this.data
        list.unshift(item)
      } else {
        this.data.unshift(item)
      }
    },

    updateItem(item) {
      if (this.tableProps?.rowKey) {
        const parentField = this.tableProps.parentField || 'parent'
        const childrenField = this.tableProps?.treeProps?.children || 'children'
        const oldItem = Utils.findRecusive(this.data, (e) => e.id === item.id)
        if (oldItem[parentField] !== item[parentField]) {
          // remove old item
          const arr = Utils.findParent(
            this.data,
            (e) => e.id === oldItem.id,
            childrenField
          )
          Utils.removeItems(arr, oldItem, 'id')
          this.addItem(item) // with to new parent
        } else {
          Object.assign(oldItem, item)
        }
      } else {
        Utils.replace(this.data, item, 'id')
      }
    },

    removeItem(item, parentField) {
      if (this.tableProps?.rowKey) {
        // find recusive in list data
        const parent = Utils.findRecusive(
          this.data,
          (item) => item.id === item[parentField]
        )
        const list =
          parent?.[this.tableProps?.treeProps?.children || 'children'] ||
          this.data
        Utils.removeItems(list, item, 'id')
      } else {
        Utils.removeItems(this.data, item, 'id')
      }
    },

    async fetchData() {
      if (!this.service) return
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
        if (this.hooks?.beforeFetch) {
          const isNext = await this.hooks.beforeFetch(payload, this)
          if (!isNext) return
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

        if (this.hooks?.afterFetch) {
          await this.hooks.afterFetch(response, this)
        }
      } catch (error) {
        console.log('DataTable fetch data error', error)
      }
      this.fetching = false
    },

    handleFilter(filterData) {
      Object.keys(filterData).forEach((path) => {
        const item = filterData[path]
        if (item.isEmpty) {
          Lodash.customUnset(this.payload.query, path)
        } else {
          Lodash.set(this.payload.query, path, item.value)
        }
      })
      this.payload.page = 1
      this.fetchData()
    },
  },
}
</script>

<style lang="scss">
.data-table {
  .table-controls {
    .left,
    .right,
    & {
      > * {
        margin-top: auto;
        margin-bottom: auto;
      }

      > * + * {
        margin-left: 10px;
      }
    }
  }

  .column-image {
    width: 48px;
    height: 48px;
    object-fit: contain;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    @apply shadow rounded bg-white;
    &:hover {
      @apply shadow-lg cursor-pointer;
    }
  }

  .column-images {
    height: 48px;
    img {
      z-index: 0;
      display: none;
      position: absolute;
      width: 48px;
      height: 48px;
      object-fit: contain;
      top: 50%;
      transform: translateY(-50%);
      @apply shadow rounded bg-white;
      &:hover {
        @apply shadow-lg cursor-pointer;
        z-index: 1;
      }
    }
    img:nth-child(1) {
      display: block;
      left: 0px;
    }
    img:nth-child(2) {
      display: block;
      left: 12px;
    }
    img:nth-child(3) {
      display: block;
      left: 24px;
    }
  }
}

.el-dialog.table-dialog-view {
  width: 100%;
  margin-top: 4vh !important;

  .el-dialog__body {
    max-height: calc(90vh - 54px);
    overflow: auto;
  }

  @media screen and (min-width: 800px) {
    width: 75%;
  }
}
</style>
