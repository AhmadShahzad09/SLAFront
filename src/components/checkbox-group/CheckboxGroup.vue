
<template>
  <div
    class="ods-checkbox-group"
    :class="{'ods-checkbox-group--full-width' : fullWidth}"
    role="group"
    aria-label="checkbox-group">
      <slot></slot>
  </div>
</template>

<script>
import Emitter from '@/addons/mixins/emitter'

export default {
  name: 'OdsCheckboxGroup',

  componentName: 'OdsCheckboxGroup',
  version: '2.0.0',
  category: 'form',
  lastDate: '29/04/2020',
  mixins: [Emitter],

  inject: {
    odsFormItem: {
      default: ''
    }
  },

  props: {
    value: {},
    disabled: Boolean,
    min: Number,
    max: Number,
    size: String,
    fill: String,
    textColor: String,
    fullWidth: Boolean
  },

  computed: {
    _odsFormItemSize () {
      return (this.odsFormItem || {}).odsFormItemSize
    },
    checkboxGroupSize () {
      return this.size || this._odsFormItemSize || (this.$ONESAITDS || {}).size
    }
  },

  watch: {
    value (value) {
      this.dispatch('OdsFormItem', 'el.form.change', [value])
    }
  }
}
</script>
