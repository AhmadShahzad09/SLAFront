<template>
  <header data-name="OdsHeader" class="ods-header" :style="{ height }">
    <slot></slot>
  </header>
</template>

<script>
export default {
  name: 'OdsHeader',
  componentName: 'OdsHeader',
  syncStatus: 'discarded',
  props: {
    height: {
      type: String,
      default: '72px'
    }
  }
}
</script>
