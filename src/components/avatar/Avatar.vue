<template>
  <div
    class="ods-avatar"
    :class="type"
    data-name="odsAvatar">
    <slot></slot>
  </div>
</template>

<script>

/**
 * @description <p>Avatar component, <a href="https://lab.onesaitplatform.com/web/ods-storybook/?path=/story/components-avatar--avatar">see and test it here</a>.</p>
 * @module Avatar
 * @category Components
 *
 * @vue-prop {String} [size] Avatar size
 *
 * @vue-computed {String} [type] Return a class that define Avatar size
 */

export default {
  name: 'OdsAvatar',
  version: '2.0.0',
  category: 'data',
  lastDate: '13/04/2020',
  syncStatus: 'not-applicable',
  props: {
    size: {
      type: String
    }
  },

  computed: {
    type: function () {
      return `ods-avatar--${this.size || 'small'}`
    }
  }
}
</script>
