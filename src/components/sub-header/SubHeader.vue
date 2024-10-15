<template>
  <div
    class="ods-sub-header"
    :class="[cssClass,
    {
      'ods-sub-header--stretch': stretch,
      'ods-sub-header--medium': medium,
      'ods-sub-header--large': large,
      'ods-sub-header--is-absolute': isAbsolute,
    }]">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'OdsSubHeader',
  version: '2.0.0',
  category: 'other',
  lastDate: '13/04/2020',
  syncStatus: 'not-applicable',
  props: {
    isAbsolute: {
      type: Boolean,
      default: true
    },
    stretch: {
      type: Boolean,
      default: false
    },
    cssClass: {
      type: [String, Object],
      default: ''
    },
    medium: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    }
  }
}
</script>
