import { RuleItem } from 'async-validator'
import { BaseService } from '~/utils/service'

declare global {
  type TableControlAction =
    | 'edit'
    | 'create'
    | 'view'
    | 'delete'
    | 'cancel'
    | 'save'
  interface TableColumn {
    /**
     * selection : hiển thị checkbox chọn ở mỗi row
     * index: Hiển thị số thứ tự của row
     * expand: Hiển thị row expand {@link https://element.eleme.io/#/en-US/component/table#expandable-row}.
     * template: Hiển thị component với tên component đc set trong prop component ở dưới. Component phải được đăng kí ở golbal mới có thể sử dụng.
     * slot: Thêm một slot với tên table-column-slot ra bên ngoài
     */
    type: 'selection' | 'index' | 'expand' | 'slot' | 'component'
    /* value or fuction return index of row when type = 'index' */
    index: number | ((index: number) => number)
    label: string
    columnKey: string
    /* Component name khi type = component */
    prop: string
    width: string
    minWidth: string
    fixed: true | 'left' | 'right'
    renderHeader: (h, { column, $index }) => void
    sortable: true | false | 'custom'
    sortMethod: (a, b) => number
    sortBy: string | [] | ((row, index) => void)
    /* Function format cell text, không hoạt động với type = component | slot */
    formatter: (row, column, cellValue, index) => void
    align: 'left' | 'center' | 'right'
    headerAlign: 'left' | 'center' | 'right'
    className: string
    labelClassName: string
    filter: 'string' & { name: string; args: any[] }
    filterMethod: (value, row, column) => void
    component: string | { name: string; props: any; events: any }
    /* disable default event handler for controls in table */
    customEvent: boolean
    showOverflowTooltip: boolean
    controls: TableControlAction[]
    controlSettings: {
      [K in TableControlAction]: {
        message?: string
        service?: BaseService
        method?: string
      }
    }
  }

  interface FilterItem {
    label: string
    path: string
    service: BaseService
    options: any[]
    defaultChecked: any
    placement: 'left' | 'right'
    limit: number
    labelKey: string
    valueKey: string
    method: 'list' | 'find'
    payload: ListPayload
  }

  interface TableProps {
    columns: TableColumn[]
    data: any[]
    service: BaseService
    method: 'list' | 'find'
    options: {
      search: boolean
      filter: {
        items: FilterItem[]
      }
    }
    dialogs: {
      [K in TableControlAction]: {
        title: string
        width: string
        fields: { [x: string]: DynamicFormField }
        form: {
          fields: DynamicFormField[]
        }
        payload: ListPayload
        onShow
        onSave
        onCancel
      }
    }

    filterDates: {
      field
      default
      convert: (value) => any
      dateProps: object
    }[]
    tableProps: any
    payload: ListPayload
  }

  // Dynamic Form

  interface DynamicFormField {
    prop: string // value prop
    type: 'string' | 'array'
    label: string
    formItemProps: any
    component: string
    props: any
    events: any
    rules: RuleItem | RuleItem[]
    default: any
    wrap: 'none' | 'collapse'
  }

  interface DynamicFormProps {
    data: any
    fields: DynamicFormField[]
  }

  interface SelectEntityProps {
    value: any
    service: BaseService
    defaultOptions: { id: any; name: any }[]
    method: 'list' | 'find'
    payload: ListPayload
    selectProps: {
      clearable: boolean
      placeholder: string
    }
    valueKey: 'id'
    labelKey: 'name'
    limit: number
    crud: {
      create: {
        service: BaseService
        payload: CreatePayload
        method: string
        field: string
      }
      edit: {
        service: BaseService
        payload: UpdatePayload
        method: string
        field: string
      }
      delete: {
        service: BaseService
        payload: DeletePayload
        method: string
        field: string
      }
    }
    filterDataMethod: (data: any[], ctx: any) => any[]
  }
}

export {}
