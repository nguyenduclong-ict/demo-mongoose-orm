import Vue from 'vue'
import { Services } from '~/config/services'
import dayjs from '~/utils/dayjs'
import * as lodash from '~/utils/lodash'
import numeral from '~/utils/numeral'
import { getErrorMessage } from '~/utils/utils'

Vue.mixin({
  inject: {
    _: { default: lodash },
    dayjs: { default: dayjs },
    $services: { default: Services },
  },

  filters: {
    date(value, format = 'DD/MM/YYYY', options) {
      options = lodash.defaultsDeep(options, {
        error: 'Invalid Date',
      })
      const date = dayjs(value, options.inputFormat)
      if (!date.isValid()) {
        return options.error
      }
      return date.format(format)
    },
    number(value, format = '0,0.[000000000]') {
      return numeral(value).format(format)
    },
    money(value, format = '0,0.[000000000]') {
      return numeral(value).format(format) + ' ₫'
    },
    dayOfWeek(value) {
      return value < 6 ? 'Thứ ' + (value + 2) : 'Chủ nhật'
    },
  },

  methods: {
    clearValidateForm(refForm) {
      refForm.resetFields()
      this.$nextTick(() => refForm.clearValidate())
    },

    validateForm(form) {
      return new Promise((resolve) =>
        form.validate((valid) => {
          resolve(valid)
        })
      )
    },

    getImageSrc(value, width, height) {
      let url = value?.url || value
      if (!url) return null
      if (width || height) {
        url += `?size=${width}x${height}`
      }
      return url
    },

    $initTable(config) {
      return config
    },
    $initSelectEntity(config) {
      return config
    },

    getErrorMessage,

    showError(error) {
      this.$message.error(this.getErrorMessage(error))
    },
  },
})
