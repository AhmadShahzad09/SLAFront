<template>
  <div :class="[
    type === 'textarea' ? 'ods-textarea' : 'ods-input',
    inputSize ? 'ods-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'ods-input-group': $slots.prepend || $slots.append,
      'ods-input-group--append': $slots.append,
      'ods-input-group--prepend': $slots.prepend,
      'ods-input--prefix': $slots.prefix || prefixIcon,
      'ods-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword,
      'ods-input--white': isWhite,
      'ods-input--search': searchInput | searchInputToggle,
      'ods-input--search-toggle': searchInputToggle,
      'is-expanded': searchExpanded
    }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    data-name="OdsInput">
    <label
      :for="id || computedLabel"
      v-if="label"
      class="ods-form-item__label">
      {{ label }}
    </label>
    <template v-if="type !== 'textarea'">
      <div class="ods-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :style="alignRight ? 'text-align: right;' : ''"
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="ods-input__inner"
        v-bind="$attrs"
        :type="showPassword ? (passwordVisible ? 'text': 'password') : type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autoComplete || autocomplete"
        :value="nativeInputValue"
        ref="input"
        @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @compositionend="handleComposition"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        @keyup.enter="e => handleKeyEnter(e)"
        :aria-label="label"
        :id="id || computedLabel">
      <span class="ods-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="ods-input__icon"
            v-if="prefixIcon"
            :class="prefixIcon">
        </i>
      </span>
      <span
        class="ods-input__suffix"
        v-if="$slots.suffix || suffixIcon || showClear || showPassword || validateState && needStatusIcon">
        <span class="ods-input__suffix-inner">
          <span v-if="showPwdVisible"
            class="ods-input__icon ods-icon-eye ods-input__clear"
            @click="handlePasswordVisible"></span>
          <template v-if="!showClear">
            <slot name="suffix"></slot>
            <i class="ods-input__icon"
              v-if="suffixIcon"
              :class="suffixIcon">
            </i>
          </template>
          <span v-else
            class="ods-input__icon ods-icon-circle-close ods-input__clear"
            @click="clear"/>
        </span>
        <span class="ods-input__icon"
          v-if="validateState"
          :class="['ods-input__validateIcon', validateIcon]"/>
      </span>
      <div class="ods-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="ods-textarea__inner"
      :value="nativeInputValue"
      @compositionstart="handleComposition"
      @compositionupdate="handleComposition"
      @compositionend="handleComposition"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autoComplete || autocomplete"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
      :id="id || computedLabel">
    </textarea>
  </div>
</template>
<script>
import emitter from '@/addons/mixins/emitter'
import Migrating from '@/addons/mixins/migrating'
import calcTextareaHeight from './calcTextareaHeight'
import merge from '@/addons/utils/merge'

export default {
  name: 'OdsInput',
  version: '2.0.0',
  category: 'form',
  lastDate: '29/04/2020',
  componentName: 'OdsInput',
  syncStatus: 'diverged',

  mixins: [emitter, Migrating],

  inheritAttrs: false,

  inject: {
    odsForm: {
      default: ''
    },
    odsFormItem: {
      default: ''
    }
  },

  data () {
    return {
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      isOnComposition: false,
      passwordVisible: false,
      searchExpanded: false
    }
  },

  props: {
    searchInput: {
      type: Boolean,
      default: false
    },
    searchInputToggle: {
      type: Boolean,
      default: false
    },
    alignRight: {
      type: Boolean,
      default: false
    },
    value: [String, Number],
    size: String,
    resize: String,
    form: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    /** @Deprecated in next major version */
    autoComplete: {
      type: String,
      validator (val) {
        process.env.NODE_ENV !== 'production' &&
            console.warn('[Onesait Warn][Input]\'auto-complete\' property will be deprecated in next major version. please use \'autocomplete\' instead.')
        return true
      }
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    tabindex: String,
    isWhite: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    }
  },

  computed: {
    _odsFormItemSize () {
      return (this.odsFormItem || {}).odsFormItemSize
    },
    validateState () {
      return this.odsFormItem ? this.odsFormItem.validateState : ''
    },
    needStatusIcon () {
      return this.odsForm ? this.odsForm.statusIcon : false
    },
    validateIcon () {
      return {
        validating: 'ods-icon-loading',
        success: 'ods-icon-circle-check',
        error: 'ods-icon-circle-close'
      }[this.validateState]
    },
    textareaStyle () {
      return merge({}, this.textareaCalcStyle, { resize: this.resize })
    },
    inputSize () {
      return this.size || this._odsFormItemSize || (this.$ONESAITDS || {}).size
    },
    inputDisabled () {
      return this.disabled || (this.odsForm || {}).disabled
    },
    nativeInputValue () {
      return this.value === null || this.value === undefined ? '' : this.value
    },
    showClear () {
      return this.clearable &&
          !this.inputDisabled &&
          !this.readonly &&
          this.nativeInputValue
    },
    showPwdVisible () {
      return this.showPassword &&
          !this.inputDisabled &&
          !this.readonly &&
          (!!this.nativeInputValue || this.focused)
    },
    computedLabel () {
      if (this.label) {
        return this.label.replace(/ /g, '-').toLowerCase() + '-' + Math.random().toString(36).substr(2, 5)
      } else {
        return false
      }
    }
  },

  watch: {
    value (val) {
      this.$nextTick(this.resizeTextarea)
      if (this.validateEvent) {
        this.dispatch('OdsFormItem', 'el.form.change', [val])
      }
    }
  },

  methods: {
    focus () {
      this.getInput().focus()
    },
    blur () {
      this.getInput().blur()
    },
    handleKeyEnter (e) {
      this.$emit('keyEnter', e)
    },
    getMigratingConfig () {
      return {
        props: {
          'icon': 'icon is removed, use suffix-icon / prefix-icon instead.',
          'on-icon-click': 'on-icon-click is removed.'
        },
        events: {
          'click': 'click is removed.'
        }
      }
    },
    handleBlur (event) {
      this.focused = false
      this.$emit('blur', event)
      if (this.validateEvent) {
        this.dispatch('OdsFormItem', 'el.form.blur', [this.value])
      }
    },
    select () {
      this.getInput().select()
    },
    resizeTextarea () {
      if (this.$isServer) return
      const { autosize, type } = this
      if (type !== 'textarea') return
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        }
        return
      }
      const minRows = autosize.minRows
      const maxRows = autosize.maxRows

      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows)
    },
    handleFocus (event) {
      this.focused = true
      this.$emit('focus', event)
    },
    handleComposition (event) {
      if (event.type === 'compositionstart') {
        this.isOnComposition = true
      }
      if (event.type === 'compositionend') {
        this.isOnComposition = false
        this.handleInput(event)
      }
    },
    handleInput (event) {
      if (this.isOnComposition) return

      // hack for https://github.com/ElemeFE/element/issues/8548
      // should remove the following line when we don't support IE
      if (event.target.value === this.nativeInputValue) return

      this.$emit('input', event.target.value)

      // set input's value, in case parent refuses the change
      // see: https://github.com/ElemeFE/element/issues/12850
      this.$nextTick(() => {
        let input = this.getInput()
        input.value = this.value
      })
    },
    handleChange (event) {
      this.$emit('change', event.target.value)
    },
    calcIconOffset (place) {
      let elList = [].slice.call(this.$el.querySelectorAll(`.ods-input__${place}`) || [])
      if (!elList.length) return
      let el = null
      for (let i = 0; i < elList.length; i++) {
        if (elList[i].parentNode === this.$el) {
          el = elList[i]
          break
        }
      }
      if (!el) return
      const pendantMap = {
        suffix: 'append',
        prefix: 'prepend'
      }

      const pendant = pendantMap[place]
      if (this.$slots[pendant]) {
        el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${this.$el.querySelector(`.ods-input-group__${pendant}`).offsetWidth}px)`
      } else {
        el.removeAttribute('style')
      }
    },
    updateIconOffset () {
      this.calcIconOffset('prefix')
      this.calcIconOffset('suffix')
    },
    clear () {
      this.$emit('input', '')
      this.$emit('change', '')
      this.$emit('clear')
    },
    handlePasswordVisible () {
      this.passwordVisible = !this.passwordVisible
      this.focus()
    },
    getInput () {
      return this.$refs.input || this.$refs.textarea
    }
  },

  created () {
    this.$on('inputSelect', this.select)
  },

  mounted () {
    this.resizeTextarea()
    this.updateIconOffset()
  },

  updated () {
    this.$nextTick(this.updateIconOffset)
  }
}
</script>
