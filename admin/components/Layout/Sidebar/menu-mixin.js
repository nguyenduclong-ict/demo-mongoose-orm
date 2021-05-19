export default {
  computed: {
    paddingStyle() {
      if (this.rootMenu.mode !== 'vertical') return {}

      let padding = 20
      let parent = this.$parent

      if (this.rootMenu.collapse) {
        padding = 20
      } else {
        while (parent && parent.$options.componentName !== 'ElMenu') {
          if (parent.$options.componentName === 'ElSubmenu') {
            padding += 20
          }
          parent = parent.$parent
        }
      }
      return { paddingLeft: padding + 'px' }
    },
  },
}
