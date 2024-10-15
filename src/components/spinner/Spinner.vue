<template>
  <span class="ods-spinner" data-name="OdsSpinner">
    <svg class="ods-spinner-inner" viewBox="0 0 50 50" v-bind:style="{ width: radius/2 + 'px', height: radius/2 + 'px' }">
      <circle class="path" cx="25" cy="25" r="20" fill="none" :stroke="strokeColor" :stroke-width="strokeWidth"></circle>
    </svg>
  </span>
</template>
<script>
export default {
  name: 'OdsSpinner',
  version: '2.0.0',
  category: 'other',
  lastDate: '13/04/2020',
  syncStatus: 'aligned',
  props: {
    type: String,
    radius: {
      type: Number,
      default: 100
    },
    strokeWidth: {
      type: Number,
      default: 5
    },
    strokeColor: {
      type: String,
      default: '#87BEE6'
    }
  }
}
</script>
