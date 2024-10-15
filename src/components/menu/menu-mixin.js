export default {
  inject: ['rootMenu'],
  computed: {
    indexPath () {
      const path = [this.index]
      let parent = this.$parent
      while (parent.$options.componentName !== 'OdsMenu') {
        if (parent.index) {
          path.unshift(parent.index)
        }
        parent = parent.$parent
      }
      return path
    },
    parentMenu () {
      let parent = this.$parent
      while (
        parent &&
        ['OdsMenu', 'OdsSubmenu'].indexOf(parent.$options.componentName) === -1
      ) {
        parent = parent.$parent
      }
      return parent
    },
    paddingStyle () {
      if (this.rootMenu.mode !== 'vertical') return {}

      let padding = 26
      let parent = this.$parent

      if (this.rootMenu.collapse) {
        padding = 26
      } else {
        while (parent && parent.$options.componentName !== 'OdsMenu') {
          if (parent.$options.componentName === 'OdsSubmenu') {
            padding += 26
          }
          parent = parent.$parent
        }
      }
      return { paddingLeft: padding + 'px' }
    }
  }
}
