<template>
  <div data-name="OdsModule" class="ods-module" :class="shadow ? 'is-' + shadow + '-shadow' : 'is-always-shadow'">
    <div class="ods-module__header" v-if="$slots.header || header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="ods-module__body" :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OdsModule',
  version: '2.0.0',
  category: 'notification',
  lastDate: '13/04/2020',
  syncStatus: 'aligned-renamed',
  props: {
    header: {},
    bodyStyle: {},
    shadow: {
      type: String
    }
  }
}
</script>
