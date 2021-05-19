import { getService } from '~/config/services'

export function getFieldConfig(field, schemas) {
  let component
  const props = {}
  const rules = {
    required: field.required || false,
  }
  const validateAny = (rule, value, cb) => {
    if (rule.required && !value) {
      return cb(new Error(field.prop + ' is required'))
    }
    cb()
  }
  const map = {
    String: () => {
      rules.type = 'string'
      component = 'ElInput'
      if (field.enum) {
        component = 'FormSelect'
        props.selectOptions = field.enum.map((e) => ({
          value: e,
          label: field.ui?.enumMap?.[e] || e,
        }))
      } else if (field.subType === 'textarea') props.type = 'textarea'
    },
    Number: () => {
      component = 'InputNumber'
      props.min = field.min
      props.max = field.max
      rules.type = 'number'
    },
    Boolean: () => {
      component = 'ElSwitch'
      rules.type = 'boolean'
    },
    Mixed: () => {
      component = 'FormMixed'
      props.type = 'textarea'
      props.autosize = true
      rules.type = 'object'
    },
    Array: () => {
      rules.type = 'array'
      props.style = 'width: 100%;'
      if (field.arrayType === 'ObjectId') {
        component = 'SelectEntity'
        props.service = getService(field.ref, schemas[field.ref]?.endpoint)
        props.limit = props.max || 1000
        props.payload = props.payload || {
          query: {},
          search: '',
          page: 1,
          pageSize: 1000,
          total: 0,
          exact: true,
        }
      } else {
        component = 'FormSelect'
        if (field.enum) {
          props.selectOptions = field.enum.map((e) => ({
            value: e,
            label: field.ui?.enumMap?.[e] || e,
          }))
          props.allowCreate = false
        } else {
          props['default-first-option'] = true
          props.allowCreate = true
          props.filterable = true
          props.multiple = true
        }
      }
    },
    ObjectId: () => {
      component = 'SelectEntity'
      props.service = getService(field.ref, schemas[field.ref]?.endpoint)
      props.limit = 1
      props.style = 'width: 100%;'
      rules.validator = validateAny
    },
    Date() {
      component = 'ElDatePicker'
      props.format = 'dd-MM-yyyy'
      rules.validator = validateAny
      if (field.subType === 'datetime') {
        props.type = 'datetime'
        props.format = 'dd-MM-yyyy HH:mm'
      }
    },
  }
  map[field.type] && map[field.type]()
  if (field.ui?.type) {
    component = field.ui?.type
  }
  Object.assign(props, field.ui?.form?.input || {})
  const fieldConfig = {
    label: field.name,
    component,
    props,
    rules,
  }
  if (field.ui?.form?.col) fieldConfig.col = field.ui?.form?.col
  fieldConfig.label = field.ui?.form?.label || field.name
  return fieldConfig
}
