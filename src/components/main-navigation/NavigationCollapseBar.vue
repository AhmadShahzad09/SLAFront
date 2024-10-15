<template>
<div
  v-if="!isMobile"
  class="ods-nav-collapse__bar"
  :class="{
    'has-scroll': hasScroll,
    'collapsed': collapsed
  }"
  @click="collapseClick">
  <ods-icon
    :name="collapsed ? 'double-right' : 'double-left'"
    class="ods-nav-collapse__icon"></ods-icon>
</div>
</template>

<script>

export default {
  name: 'OdsNavigationCollapseBar',

  props: {
    collapsed: {
      type: Boolean,
      required: true
    },
    hasScroll: {
      type: Boolean,
      required: true
    },
    isMobile: {
      type: Boolean,
      required: true
    }
  },

  methods: {
    collapseClick () {
      this.$emit('collapseClicked')
    }
  }
}
</script>
