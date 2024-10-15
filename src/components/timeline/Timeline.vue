<template>
  <ul class="ods-timeline"
    :class="{
      'is-reverse': reverse
    }">
    <slot></slot>
  </ul>
</template>

<script>
export default {
  name: 'OdsTimeline',
  version: '2.0.0',
  category: 'data',
  lastDate: '13/04/2020',
  syncStatus: 'aligned',

  props: {
    reverse: {
      type: Boolean,
      default: false
    }
  },

  provide () {
    return {
      timeline: this
    }
  },

  watch: {
    reverse: {
      handler (newVal) {
        if (newVal) {
          this.$slots.default = [...this.$slots.default].reverse()
        }
      },
      immediate: true
    }
  }
}
</script>
