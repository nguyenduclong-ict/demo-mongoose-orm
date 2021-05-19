<script>
import { Input } from 'element-ui'
export default {
  extends: Input,
  props: {
    value: {},
  },

  computed: {
    nativeInputValue() {
      if (!this.value) return ''
      try {
        return JSON.stringify(this.value, null, 2)
      } catch (error) {}
      return ''
    },
  },

  methods: {
    handleInput(event) {},

    handleBlur(event) {
      this.focused = false
      this.$emit('blur', event)

      let value
      try {
        value = JSON.parse(event.target.value)
        this.$emit('input', value)
        this.setNativeInputValue()
      } catch (error) {
        console.log(error)
      }
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.value])
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
