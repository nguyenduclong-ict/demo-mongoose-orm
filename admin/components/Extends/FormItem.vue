<script>
import Vue from 'vue'
import { Form, FormItem } from 'element-ui'

export default {
  inject: {
    elForm: {
      default() {
        const ElForm = Vue.extend(Form)
        const form = new ElForm()
        form.$mount()
        return form
      },
    },
  },

  extends: {
    FormItem,
  },
}
</script>

<style></style>
