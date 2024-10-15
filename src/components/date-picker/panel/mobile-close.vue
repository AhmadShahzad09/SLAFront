<template>
  <div
    v-if="isPhone"
    class="ods-picker-panel__mobile-close"
    @click="isPhoneClosePanel">
    <ods-icon name="close" size="32"></ods-icon>
  </div>
</template>

<script>
export default {
  props: {
    isPhone: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    isPhoneClosePanel () {
      let min = this.$parent.minDate
      let max = this.$parent.maxDate

      if (min && max) {
        this.$parent.$emit('pick', [min, max])
      } else {
        this.$parent.$emit('pick', null)
      }
    }
  }
}
</script>
