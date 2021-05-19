<template>
  <div class="dynamic-form">
    <el-form ref="form" :model="form">
      <el-row :gutter="12">
        <el-col
          v-for="field in computedFields"
          :key="field.prop"
          v-bind="getCol(field.col)"
        >
          <component
            :is="field.component"
            v-if="field.wrap === 'none'"
            v-model="form[field.prop]"
            v-bind.sync="field.props"
          ></component>
          <el-collapse v-else-if="field.wrap === 'collapse'">
            <el-collapse-item :title="field.label">
              <component
                :is="field.component"
                v-model="form[field.prop]"
                v-bind.sync="field.props"
              ></component>
            </el-collapse-item>
          </el-collapse>
          <el-form-item
            v-else
            :key="field.prop"
            v-bind="form.formItemProps"
            :label="field.label"
            :prop="field.prop"
            :rules="field.rules"
          >
            <component
              :is="field.component"
              :key="field.prop"
              v-model="form[field.prop]"
              v-bind.sync="field.props"
            ></component>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import VueJsonEditor from 'vue-json-editor'
import { PrismEditor } from 'vue-prism-editor'
import FormSelect from './Fields/FormSelect'
import FormMixed from './Fields/FormMixed.vue'
import InputNumber from '~/components/Global/Input/InputNumber'
import SelectEntity from '~/components/Global/Select/SelectEntity.vue'
import AddressEdit from '~/components/Global/Address/AddressEdit.vue'
import TinymceEditor from '~/components/Global/TinymceEditor.vue'
import MediaPicker from '~/components/Global/MediaPicker.vue'
import Seo from '~/components/Global/Seo.vue'
import 'vue-prism-editor/dist/prismeditor.min.css'
import { Utils } from '~/utils'

export default {
  components: {
    PrismEditor,
    VueJsonEditor,
    FormSelect,
    InputNumber,
    SelectEntity,
    AddressEdit,
    FormMixed,
    TinymceEditor,
    MediaPicker,
    Seo,
  },

  props: {
    data: {
      type: Object,
      default: () => {},
    },
    fields: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      form: {},
    }
  },

  computed: {
    computedFields() {
      return this.fields.map((field) => {
        return {
          ...Utils.getSourceValue(field, this.form),
          ...this.fieldTemplate(field),
        }
      })
    },
  },

  created() {
    this.form = { ...this.data }
    if (!this.form.id) {
      this.fields.forEach((field) => {
        if ('default' in field && field.default)
          this.form[field.prop] = field.default
      })
    }
  },

  methods: {
    fieldTemplate(field) {
      const templates = {
        Seo: {
          component: 'Seo',
        },
        Checkbox: {
          component: 'ElCheckbox',
        },
        Select: {
          component: 'FormSelect',
        },
        Address: {
          component: 'AddressEdit',
        },
        RichText: {
          component: 'TinymceEditor',
          props: {
            style: {
              width: '100%',
            },
          },
        },
        MediaPicker: {
          component: 'MediaPicker',
          props: {
            limit: field.type === 'Array' ? 100 : 1,
            ...field.props,
          },
        },
        SelectEntity: {
          component: 'SelectEntity',
          props: {
            limit: field.type === 'Array' ? 100 : 1,
            ...field.props,
            clearable: !field.required,
          },
        },
        JSON: {
          component: 'VueJsonEditor',
          props: {
            mode: 'code',
          },
        },
      }
      return templates[field.ui?.type] || templates[field.type] || {}
    },

    validate() {
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => resolve(valid))
      })
    },

    validateField(field) {
      return this.$refs.form.validateField(field)
    },

    clearValidate(props) {
      this.$refs.form.clearValidate(props)
    },

    resetFields() {
      this.$refs.form.resetFields()
    },

    getCol(col) {
      if (Number.isInteger(col))
        return {
          span: col,
        }
      return col || {}
    },
  },
}
</script>

<style lang="scss" scoped></style>
