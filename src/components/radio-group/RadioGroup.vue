<template>
  <div
    class="ods-radio-group"
    :class="{'ods-radio-group--full-width' : fullWidth}"
    role="radiogroup"
    @keydown="handleKeydown"
  >
    <slot></slot>
  </div>
</template>

<script>
import Emitter from '@/addons/mixins/emitter'

const keyCode = Object.freeze({
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
})
export default {
  name: 'OdsRadioGroup',
  version: '2.1.0',
  category: 'form',
  lastDate: '13/04/2020',
  componentName: 'OdsRadioGroup',

  inject: {
    odsFormItem: {
      default: ''
    }
  },

  mixins: [Emitter],

  props: {
    value: {},
    size: String,
    fill: String,
    textColor: String,
    disabled: Boolean,
    fullWidth: Boolean
  },

  computed: {
    _odsFormItemSize () {
      return (this.odsFormItem || {}).odsFormItemSize
    },
    radioGroupSize () {
      return this.size || this._odsFormItemSize || (this.$ONESAITDS || {}).size
    }
  },

  created () {
    this.$on('handleChange', value => {
      this.$emit('change', value)
    })
  },
  mounted () {
    // 当radioGroup没有默认选项时，第一个可以选中Tab导航
    const radios = this.$el.querySelectorAll('[type=radio]')
    const firstLabel = this.$el.querySelectorAll('[role=radio]')[0]
    if (![].some.call(radios, radio => radio.checked) && firstLabel) {
      firstLabel.tabIndex = 0
    }
  },
  methods: {
    handleKeydown (e) { // 左右上下按键 可以在radio组内切换不同选项
      const target = e.target
      const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]'
      const radios = this.$el.querySelectorAll(className)
      const length = radios.length
      const index = [].indexOf.call(radios, target)
      const roleRadios = this.$el.querySelectorAll('[role=radio]')
      switch (e.keyCode) {
        case keyCode.LEFT:
        case keyCode.UP:
          e.stopPropagation()
          e.preventDefault()
          if (index === 0) {
            roleRadios[length - 1].click()
            roleRadios[length - 1].focus()
          } else {
            roleRadios[index - 1].click()
            roleRadios[index - 1].focus()
          }
          break
        case keyCode.RIGHT:
        case keyCode.DOWN:
          if (index === (length - 1)) {
            e.stopPropagation()
            e.preventDefault()
            roleRadios[0].click()
            roleRadios[0].focus()
          } else {
            roleRadios[index + 1].click()
            roleRadios[index + 1].focus()
          }
          break
        default:
          break
      }
    }
  },
  watch: {
    value (value) {
      this.dispatch('OdsFormItem', 'el.form.change', [this.value])
    }
  }
}
</script>
