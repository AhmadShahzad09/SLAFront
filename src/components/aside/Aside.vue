<template>
  <aside data-name="OdsAside" class="ods-aside" :style="{ width }">
    <slot></slot>
  </aside>
</template>

<script>
export default {
  name: 'OdsAside',
  componentName: 'OdsAside',
  version: '2.0.0',
  lastDate: '13/04/2020',

  props: {
    width: {
      type: String,
      default: '300px'
    }
  }
}
</script>
