import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/vi'
import ElDialog from '~/components/Extends/ElDialog.vue'
import FormItem from '~/components/Extends/FormItem.vue'
import ElButton from '~/components/Extends/Button/ElButton.vue'
import { EL_SIZE } from '~/config/constants'

Vue.use(Element, { locale, size: localStorage.getItem(EL_SIZE) })
Vue.component('ElDialog', ElDialog)
Vue.component('ElButton', ElButton)
Vue.component('FormItem', FormItem)

export function changeSize(size) {
  localStorage.setItem(EL_SIZE, size)
  location.reload()
}
