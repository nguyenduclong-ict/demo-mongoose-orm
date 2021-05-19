<script>
import { Submenu } from 'element-ui'
import menuMixin from './menu-mixin'
export default {
  extends: Submenu,
  mixins: [menuMixin],
  methods: {
    handleMouseenter(event, showTimeout = this.showTimeout) {
      if (
        !('ActiveXObject' in window) &&
        event.type === 'focus' &&
        !event.relatedTarget
      ) {
        return
      }
      const { rootMenu, disabled } = this
      if (
        (rootMenu.menuTrigger === 'click' && rootMenu.mode === 'horizontal') ||
        (!rootMenu.collapse && rootMenu.mode === 'vertical') ||
        disabled
      ) {
        return
      }
      this.dispatch('ElSubmenu', 'mouse-enter-child')
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.rootMenu.openMenu(this.index, this.indexPath)
      }, showTimeout)

      if (this.appendToBody) {
        // this.$parent.$el.dispatchEvent(new MouseEvent('mouseenter'))
      }
    },
  },
}
</script>
