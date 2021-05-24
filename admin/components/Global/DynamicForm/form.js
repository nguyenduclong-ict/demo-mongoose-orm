import { getService } from '~/config/services'

export function getFieldConfig(field, schemas, key) {
  let component
  let props = {}
  const map = {
    String: () => {
      component = 'ElInput'
      if (field.enum) {
        component = 'FormSelect'
        props.selectOptions = field.enum.map((e) => ({
          value: e,
          label: field.form?.enumMap?.[e] || e,
        }))
      } else if (field.subType === 'textarea') props.type = 'textarea'
    },
    Number: () => {
      component = 'InputNumber'
      props.min = field.min
      props.max = field.max
    },
    Boolean: () => {
      component = 'ElSwitch'
    },
    Mixed: () => {
      component = 'FormMixed'
      props.type = 'textarea'
      props.autosize = true
    },
    Array: () => {
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
            label: field.form?.enumMap?.[e] || e,
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
    },
    Date() {
      component = 'ElDatePicker'
      props.format = 'dd-MM-yyyy'
      if (field.subType === 'datetime') {
        props.type = 'datetime'
        props.format = 'dd-MM-yyyy HH:mm'
      }
    },
    Seo() {
      component = 'Seo'
    },
    Checkbox() {
      component = 'ElCheckbox'
    },
    Select() {
      component = 'FormSelect'
    },
    Address() {
      component = 'AddressEdit'
    },
    RichText() {
      component = 'TinymceEditor'
      props.style = {
        width: '100%',
      }
    },
    MediaPicker() {
      component = 'MediaPicker'
      props = {
        ...props,
        limit: field.type === 'Array' ? 100 : 1,
        ...field.props,
      }
    },
    SelectEntity() {
      component = 'SelectEntity'
      props = {
        ...props,
        limit: field.type === 'Array' ? 100 : 1,
        ...field.props,
        clearable: !field.required,
      }
    },
    JSON() {
      component = 'VueJsonEditor'
      props = {
        ...props,
        mode: 'code',
      }
    },
  }
  const type = field.form?.type || field.type
  if (type) {
    map[type] && map[type]()
    const fieldConfig = {
      label: field.name || key,
      component,
      prop: key,
      props: {
        ...props,
        ...field.form?.input,
      },
      ...field.form,
    }
    return fieldConfig
  }
  return field
}
