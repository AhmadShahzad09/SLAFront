<template>
  <li class="ods-menu-item-group">
    <div class="ods-menu-item-group__title" :style="{paddingLeft: levelPadding + 'px'}">
      <template v-if="!$slots.title">{{title}}</template>
      <slot v-else name="title"></slot>
    </div>
    <ul>
      <slot></slot>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'OdsMenuItemGroup',

  componentName: 'OdsMenuItemGroup',

  inject: ['rootMenu'],
  props: {
    title: {
      type: String
    }
  },
  data () {
    return {
      paddingLeft: 26
    }
  },
  computed: {
    levelPadding () {
      let padding = 26
      let parent = this.$parent
      if (this.rootMenu.collapse) return 26
      while (parent && parent.$options.componentName !== 'OdsMenu') {
        if (parent.$options.componentName === 'OdsSubmenu') {
          padding += 26
        }
        parent = parent.$parent
      }
      return padding
    }
  }
}
</script>
