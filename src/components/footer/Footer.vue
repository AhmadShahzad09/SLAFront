<template>
  <footer data-name="OdsFooter" class="ods-footer" :style="{ height }">
    <slot></slot>
  </footer>
</template>

<script>
export default {
  name: 'OdsFooter',
  version: '2.0.0',
  category: 'form',
  lastDate: '13/04/2020',
  syncStatus: 'aligned',

  componentName: 'OdsFooter',

  props: {
    height: {
      type: String,
      default: '60px'
    }
  }
}
</script>
