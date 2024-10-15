<template>
  <label
    :for="label"
    data-name="OdsRadio"
    class="ods-radio"
    :class="[
      border && radioSize ? 'ods-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span class="ods-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="ods-radio__inner"></span>
      <input
        ref="radio"
        class="ods-radio__original"
        :value="label"
        :id="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
      >
    </span>
    <span class="ods-radio__label" @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
import Emitter from '@/addons/mixins/emitter'

export default {
  name: 'OdsRadio',
  version: '2.0.0',
  category: 'form',
  lastDate: '13/04/2020',
  syncStatus: 'aligned-extended',
  mixins: [Emitter],

  inject: {
    odsForm: {
      default: ''
    },

    odsFormItem: {
      default: ''
    }
  },

  componentName: 'OdsRadio',

  props: {
    value: {},
    label: {
      type: [String, Number, Boolean, Array],
      required: true
    },
    disabled: Boolean,
    name: String,
    border: Boolean,
    size: String
  },

  data () {
    return {
      focus: false
    }
  },
  computed: {
    isGroup () {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.componentName !== 'OdsRadioGroup') {
          parent = parent.$parent
        } else {
          this._radioGroup = parent
          return true
        }
      }
      return false
    },
    model: {
      get () {
        return this.isGroup ? this._radioGroup.value : this.value
      },
      set (val) {
        if (this.isGroup) {
          this.dispatch('OdsRadioGroup', 'input', [val])
        } else {
          this.$emit('input', val)
        }
        this.$refs.radio && (this.$refs.radio.checked = this.model === this.label)
      }
    },
    _odsFormItemSize () {
      return (this.odsFormItem || {}).odsFormItemSize
    },
    radioSize () {
      const temRadioSize = this.size || this._odsFormItemSize || (this.$ONESAITDS || {}).size
      return this.isGroup
        ? this._radioGroup.radioGroupSize || temRadioSize
        : temRadioSize
    },
    isDisabled () {
      return this.isGroup
        ? this._radioGroup.disabled || this.disabled || (this.odsForm || {}).disabled
        : this.disabled || (this.odsForm || {}).disabled
    },
    tabIndex () {
      return (this.isDisabled || (this.isGroup && this.model !== this.label)) ? -1 : 0
    }
  },

  methods: {
    handleChange () {
      this.$nextTick(() => {
        this.$emit('change', this.model)
        this.isGroup && this.dispatch('OdsRadioGroup', 'handleChange', this.model)
      })
    }
  }
}
</script>
