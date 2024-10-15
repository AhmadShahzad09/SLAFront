<template>
  <ul class="ods-select-group__wrap" v-show="visible">
    <li class="ods-select-group__title">{{ label }}</li>
    <li>
      <ul class="ods-select-group">
        <slot></slot>
      </ul>
    </li>
  </ul>
</template>

<script type="text/babel">
import Emitter from '@/addons/mixins/emitter'

export default {
  mixins: [Emitter],
  name: 'OdsOptionGroup',
  componentName: 'OdsOptionGroup',
  props: {
    label: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      visible: true
    }
  },

  watch: {
    disabled (val) {
      this.broadcast('OdsOption', 'handleGroupDisabled', val)
    }
  },

  methods: {
    queryChange () {
      this.visible = this.$children &&
          Array.isArray(this.$children) &&
          this.$children.some(option => option.visible === true)
    }
  },

  created () {
    this.$on('queryChange', this.queryChange)
  },

  mounted () {
    if (this.disabled) {
      this.broadcast('OdsOption', 'handleGroupDisabled', this.disabled)
    }
  }
}
</script>
