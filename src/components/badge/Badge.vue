<template>
  <div
    :class="{'is-line': isLine && type === 'primary'}"
    class="ods-badge"
    data-name="OdsBadge">
    <slot></slot>
    <transition name="ods-zoom-in-center">
      <sup
        v-show="!hidden && (content || content === 0 || isDot)"
        v-text="content"
        class="ods-badge__content"
        :class="[
          'ods-badge__content--' + type,
          {
            'is-fixed': $slots.default,
            'is-dot': isDot
          }
        ]">
      </sup>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'OdsBadge',
  version: '2.0.0',
  category: 'data',
  lastDate: '13/04/2020',
  props: {
    value: {},
    max: Number,
    isDot: Boolean,
    isLine: Boolean,
    hidden: Boolean,
    type: {
      type: String,
      validator (val) {
        return ['primary', 'secondary', 'success', 'warning', 'info', 'danger'].indexOf(val) > -1
      },
      default: 'secondary'
    }
  },

  computed: {
    content () {
      if (this.isDot) return

      const value = this.value
      const max = this.max

      if (typeof value === 'number' && typeof max === 'number') {
        return max < value ? `${max}+` : value
      }

      return value
    }
  }
}
</script>
