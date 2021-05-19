<script>
import { Input } from 'element-ui'
import numeral from '~/utils/numeral'
import { Lodash } from '~/utils'
export default {
  name: 'InputNumber',
  extends: Input,
  props: {
    max: {
      type: Number,
      default: Infinity,
    },
    min: {
      type: Number,
      default: -Infinity,
    },
    format: {
      type: String,
      default: '0,0.[000000000]',
    },
    nullValue: {
      type: [Number, String],
      default: null,
    },
  },
  computed: {
    nativeInputValue() {
      return Lodash.isNil(this.value)
        ? String(this.nullValue ?? '')
        : numeral(this.value).format(this.format)
    },
  },
  methods: {
    handleInput(event) {
      // should not emit input during composition
      // see: https://github.com/ElemeFE/element/issues/10516
      if (this.isComposing) return

      // hack for https://github.com/ElemeFE/element/issues/8548
      // should remove the following line when we don't support IE
      if (event.target.value === this.nativeInputValue) return

      // restore position of cursor
      const pos = this.$refs.input.selectionStart
      const oldNativeInputValue = this.nativeInputValue

      let number = numeral(event.target.value)
      let value = number.value()
      if (!isNaN(value)) {
        if (value > this.max) {
          number = numeral(String(this.max))
          value = this.max
        } else if (value < this.min) {
          number = numeral(String(this.min))
          value = this.min
        }
        if (!number._input.endsWith('.')) {
          this.$emit('input', value)
          this.setNativeInputValue()
          this.$nextTick(() => {
            const length = (this.nativeInputValue || '').length
            const lengthOld = (oldNativeInputValue || '').length
            const diff = length - lengthOld

            if (diff === 0) {
              this.$refs.input.selectionEnd = pos
            }
            if (diff > 0) {
              this.$refs.input.selectionEnd = pos + (diff - 1)
            }
            if (diff < 0) {
              this.$refs.input.selectionEnd = pos + (diff + 1)
            }
          })
        }
      }
    },

    handleBlur(event) {
      this.focused = false
      this.$emit('blur', event)

      // Check valid input and revert to pre value
      const inputValue = this.getInput().value
      const number = numeral(inputValue)
      const value = number.value()

      if (isNaN(value)) {
        this.setNativeInputValue()
      }

      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.value])
      }
    },
  },
}
</script>
