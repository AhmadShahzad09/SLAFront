<template>
  <label
    data-name="OdsCheckbox"
    class="ods-checkbox"
    :class="[
      border && checkboxSize ? 'ods-checkbox--' + checkboxSize : '',
      { 'is-disabled': isDisabled },
      { 'is-bordered': border },
      { 'is-checked': isChecked }
    ]"
    role="checkbox"
    :aria-checked="indeterminate ? 'mixed': isChecked"
    :aria-disabled="isDisabled"
    :id="id"
    :for="checkboxLabel"
  >
    <span class="ods-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
       aria-checked="mixed"
    >
      <span class="ods-checkbox__inner"></span>
      <input
        v-if="trueLabel || falseLabel"
        class="ods-checkbox__original"
        type="checkbox"
        aria-hidden="true"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false"
        :id="checkboxLabel">
      <input
        v-else
        class="ods-checkbox__original"
        type="checkbox"
        aria-hidden="true"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false"
        :id="checkboxLabel">
    </span>
    <span class="ods-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
import Emitter from '@/addons/mixins/emitter'

export default {
  name: 'OdsCheckbox',
  version: '2.0.1',
  category: 'form',
  lastDate: '03/09/2020',
  syncStatus: 'aligned',
  mixins: [Emitter],

  inject: {
    odsForm: {
      default: ''
    },
    odsFormItem: {
      default: ''
    }
  },

  componentName: 'OdsCheckbox',

  data () {
    return {
      selfModel: false,
      focus: false,
      isLimitExceeded: false
    }
  },

  computed: {
    model: {
      get () {
        return this.isGroup
          ? this.store : this.value !== undefined
            ? this.value : this.selfModel
      },

      set (val) {
        if (this.isGroup) {
          this.isLimitExceeded = false;
          (this._checkboxGroup.min !== undefined &&
              val.length < this._checkboxGroup.min &&
              (this.isLimitExceeded = true));

          (this._checkboxGroup.max !== undefined &&
              val.length > this._checkboxGroup.max &&
              (this.isLimitExceeded = true))

          this.isLimitExceeded === false &&
            this.dispatch('OdsCheckboxGroup', 'input', [val])
        } else {
          this.$emit('input', val)
          this.selfModel = val
        }
      }
    },

    isChecked () {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        return this.model
      } else if (Array.isArray(this.model)) {
        return this.model.indexOf(this.label) > -1
      } else if (this.model !== null && this.model !== undefined) {
        return this.model === this.trueLabel
      }
    },

    isGroup () {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.componentName !== 'OdsCheckboxGroup') {
          parent = parent.$parent
        } else {
          this._checkboxGroup = parent
          return true
        }
      }
      return false
    },

    store () {
      return this._checkboxGroup ? this._checkboxGroup.value : this.value
    },

    /* used to make the isDisabled judgment under max/min props */
    isLimitDisabled () {
      const { max, min } = this._checkboxGroup
      return !!(max || min) &&
          (this.model.length >= max && !this.isChecked) ||
          (this.model.length <= min && this.isChecked)
    },

    isDisabled () {
      return this.isGroup
        ? this._checkboxGroup.disabled || this.disabled || (this.odsForm || {}).disabled
        : this.disabled || (this.odsForm || {}).disabled
    },

    _odsFormItemSize () {
      return (this.odsFormItem || {}).odsFormItemSize
    },

    checkboxSize () {
      const temCheckboxSize = this.size || this._odsFormItemSize || (this.$ONESAITDS || {}).size
      return this.isGroup
        ? this._checkboxGroup.checkboxGroupSize || temCheckboxSize
        : temCheckboxSize
    }
  },

  props: {
    value: {},
    label: {},
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number],
    id: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系 */
    controls: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系 */
    border: Boolean,
    size: String,
    checkboxLabel: String
  },

  methods: {
    addToStore () {
      if (
        Array.isArray(this.model) &&
          this.model.indexOf(this.label) === -1
      ) {
        this.model.push(this.label)
      } else {
        this.model = this.trueLabel || true
      }
    },
    handleChange (ev) {
      if (this.isLimitExceeded) return
      let value
      if (ev.target.checked) {
        value = this.trueLabel === undefined ? true : this.trueLabel
      } else {
        value = this.falseLabel === undefined ? false : this.falseLabel
      }
      this.$emit('change', value, ev)
      this.$nextTick(() => {
        if (this.isGroup) {
          this.dispatch('OdsCheckboxGroup', 'change', [this._checkboxGroup.value])
        }
        if (!ev.target.checked) {
          this.focus = false
        }
      })
    }
  },

  created () {
    this.checked && this.addToStore()
  },
  mounted () { // 为indeterminate元素 添加aria-controls 属性
    if (this.indeterminate) {
      this.$el.setAttribute('aria-controls', this.controls)
    }
  },

  watch: {
    value (value) {
      this.dispatch('OdsFormItem', 'el.form.change', value)
    }
  }
}
</script>
