<template>
  <span
    data-name="OdsCascader"
    class="ods-cascader"
    :class="[
      {
        'is-opened': menuVisible,
        'is-disabled': cascaderDisabled
      },
      cascaderSize ? 'ods-cascader--' + cascaderSize : ''
    ]"
    @click="handleClick"
    @mouseenter="inputHover = true"
    @focus="inputHover = true"
    @mouseleave="inputHover = false"
    @blur="inputHover = false"
    ref="reference"
    v-clickoutside="handleClickoutside"
    @keydown="handleKeydown">
    <label
      v-if="showCascaderLabel"
      :for="cascaderLabel"
      class="ods-form-item__label ods-form-item__label--cascader">
        {{cascaderLabel}}
    </label>
    <span class="ods-cascader__relative-wrap">
      <ods-input
        :id="cascaderLabel"
        :isWhite="isWhite"
        ref="input"
        :readonly="readonly"
        :placeholder="currentLabels.length ? undefined : placeholder"
        v-model="inputValue"
        @input="debouncedInputChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @compositionstart.native="handleComposition"
        @compositionend.native="handleComposition"
        :validate-event="false"
        :size="size"
        :disabled="cascaderDisabled"
        :class="{ 'is-focus': menuVisible }"
      >
        <template slot="suffix">
          <span
            key="1"
            v-if="clearable && inputHover && currentLabels.length"
            class="ods-input__icon ods-icon-circle-close ods-cascader__clearIcon"
            @click="clearValue"
          ></span>
          <span
            key="2"
            v-else
            class="ods-input__icon ods-icon-arrow-down"
            :class="{ 'is-reverse': menuVisible }"
          ></span>
        </template>
      </ods-input>
    <span class="ods-cascader__label" v-show="inputValue === '' && !isOnComposition">
      <template v-if="showAllLevels">
        <template v-for="(label, index) in currentLabels">
          {{ label }}
          <span v-if="index < currentLabels.length - 1" :key="index"> {{ separator }} </span>
        </template>
      </template>
      <template v-else>
        {{ currentLabels[currentLabels.length - 1] }}
      </template>
    </span>
    </span>
  </span>
</template>

<script>
import Vue from 'vue'
import OdsCascaderMenu from './CascaderMenu'
import OdsInput from '@/components/input/Input'
import Popper from '@/addons/utils/vue-popper'
import Clickoutside from '@/addons/utils/clickoutside'
import emitter from '@/addons/mixins/emitter'
import Locale from '@/addons/mixins/locale'
import { t } from '@/addons/locale'
import debounce from 'throttle-debounce/debounce'
import { generateId, escapeRegexpString, isIE, isEdge } from '@/addons/utils/util'

const popperMixin = {
  props: {
    isWhite: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    appendToBody: Popper.props.appendToBody,
    arrowOffset: Popper.props.arrowOffset,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions,
    cascaderLabel: String,
    showCascaderLabel: {
      type: Boolean,
      default: false
    }
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
}

export default {
  name: 'OdsCascader',
  version: '2.0.0',
  category: 'form',
  lastDate: '13/04/2020',
  directives: { Clickoutside },

  mixins: [popperMixin, emitter, Locale],

  inject: {
    odsForm: {
      default: ''
    },
    odsFormItem: {
      default: ''
    }
  },

  components: {
    OdsInput
  },

  props: {
    options: {
      type: Array,
      required: true
    },
    props: {
      type: Object,
      default () {
        return {
          children: 'children',
          label: 'label',
          value: 'value',
          disabled: 'disabled'
        }
      }
    },
    value: {
      type: Array,
      default () {
        return []
      }
    },
    separator: {
      type: String,
      default: '/'
    },
    placeholder: {
      type: String,
      default () {
        return t('el.cascader.placeholder')
      }
    },
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    changeOnSelect: Boolean,
    popperClass: String,
    expandTrigger: {
      type: String,
      default: 'click'
    },
    filterable: Boolean,
    size: String,
    showAllLevels: {
      type: Boolean,
      default: true
    },
    debounce: {
      type: Number,
      default: 300
    },
    beforeFilter: {
      type: Function,
      default: () => () => {}
    },
    hoverThreshold: {
      type: Number,
      default: 500
    }
  },

  data () {
    return {
      currentValue: this.value || [],
      menu: null,
      debouncedInputChange () {},
      menuVisible: false,
      inputHover: false,
      inputValue: '',
      flatOptions: null,
      id: generateId(),
      needFocus: true,
      isOnComposition: false
    }
  },

  computed: {
    labelKey () {
      return this.props.label || 'label'
    },
    valueKey () {
      return this.props.value || 'value'
    },
    childrenKey () {
      return this.props.children || 'children'
    },
    disabledKey () {
      return this.props.disabled || 'disabled'
    },
    currentLabels () {
      let options = this.options
      let labels = []
      this.currentValue.forEach(value => {
        const targetOption = options && options.filter(option => option[this.valueKey] === value)[0]
        if (targetOption) {
          labels.push(targetOption[this.labelKey])
          options = targetOption[this.childrenKey]
        }
      })
      return labels
    },
    _odsFormItemSize () {
      return (this.odsFormItem || {}).eodsFormItemSize
    },
    cascaderSize () {
      return this.size || this._odsFormItemSize || (this.$ONESAITDS || {}).size
    },
    cascaderDisabled () {
      return this.disabled || (this.odsForm || {}).disabled
    },
    readonly () {
      return !this.filterable || (!isIE() && !isEdge() && !this.menuVisible)
    }
  },

  watch: {
    menuVisible (value) {
      this.$refs.input.$refs.input.setAttribute('aria-expanded', value)
      value ? this.showMenu() : this.hideMenu()
      this.$emit('visible-change', value)
    },
    value (value) {
      this.currentValue = value
    },
    currentValue (value) {
      this.dispatch('OdsFormItem', 'el.form.change', [value])
    },
    currentLabels (value) {
      const inputLabel = this.showAllLevels ? value.join('/') : value[value.length - 1]
      this.$refs.input.$refs.input.setAttribute('value', inputLabel)
    },
    options: {
      deep: true,
      handler (value) {
        if (!this.menu) {
          this.initMenu()
        }
        this.flatOptions = this.flattenOptions(this.options)
        this.menu.options = value
      }
    }
  },

  methods: {
    initMenu () {
      this.menu = new Vue(OdsCascaderMenu).$mount()
      this.menu.options = this.options
      this.menu.props = this.props
      this.menu.expandTrigger = this.expandTrigger
      this.menu.changeOnSelect = this.changeOnSelect
      this.menu.popperClass = this.popperClass
      this.menu.hoverThreshold = this.hoverThreshold
      this.popperElm = this.menu.$el
      this.menu.$refs.menus[0].setAttribute('id', `cascader-menu-${this.id}`)
      this.menu.$on('pick', this.handlePick)
      this.menu.$on('activeItemChange', this.handleActiveItemChange)
      this.menu.$on('menuLeave', this.doDestroy)
      this.menu.$on('closeInside', this.handleClickoutside)
    },
    showMenu () {
      if (!this.menu) {
        this.initMenu()
      }

      this.menu.value = this.currentValue.slice(0)
      this.menu.visible = true
      this.menu.options = this.options
      this.$nextTick(_ => {
        this.updatePopper()
        this.menu.inputWidth = this.$refs.input.$el.offsetWidth - 2
      })
    },
    hideMenu () {
      this.inputValue = ''
      this.menu.visible = false
      if (this.needFocus) {
        this.$refs.input.focus()
      } else {
        this.needFocus = true
      }
    },
    handleActiveItemChange (value) {
      this.$nextTick(_ => {
        this.updatePopper()
      })
      this.$emit('active-item-change', value)
    },
    handleKeydown (e) {
      const keyCode = e.keyCode
      if (keyCode === 13) {
        this.handleClick()
      } else if (keyCode === 40) { // down
        this.menuVisible = true // 打开
        setTimeout(() => {
          const firstMenu = this.popperElm.querySelectorAll('.ods-cascader-menu')[0]
          firstMenu.querySelectorAll("[tabindex='-1']")[0].focus()
        })
        e.stopPropagation()
        e.preventDefault()
      } else if (keyCode === 27 || keyCode === 9) { // esc  tab
        this.inputValue = ''
        if (this.menu) this.menu.visible = false
      }
    },
    handlePick (value, close = true) {
      this.currentValue = value
      this.$emit('input', value)
      this.$emit('change', value)

      if (close) {
        this.menuVisible = false
      } else {
        this.$nextTick(this.updatePopper)
      }
    },
    handleInputChange (value) {
      if (!this.menuVisible) return
      const flatOptions = this.flatOptions

      if (!value) {
        this.menu.options = this.options
        this.$nextTick(this.updatePopper)
        return
      }

      let filteredFlatOptions = flatOptions.filter(optionsStack => {
        return optionsStack.some(option => new RegExp(escapeRegexpString(value), 'i')
          .test(option[this.labelKey]))
      })

      if (filteredFlatOptions.length > 0) {
        filteredFlatOptions = filteredFlatOptions.map(optionStack => {
          return {
            __IS__FLAT__OPTIONS: true,
            value: optionStack.map(item => item[this.valueKey]),
            label: this.renderFilteredOptionLabel(value, optionStack),
            disabled: optionStack.some(item => item[this.disabledKey])
          }
        })
      } else {
        filteredFlatOptions = [{
          __IS__FLAT__OPTIONS: true,
          label: this.t('el.cascader.noMatch'),
          value: '',
          disabled: true
        }]
      }
      this.menu.options = filteredFlatOptions
      this.$nextTick(this.updatePopper)
    },
    renderFilteredOptionLabel (inputValue, optionsStack) {
      return optionsStack.map((option, index) => {
        const label = option[this.labelKey]
        const keywordIndex = label.toLowerCase().indexOf(inputValue.toLowerCase())
        const labelPart = label.slice(keywordIndex, inputValue.length + keywordIndex)
        const node = keywordIndex > -1 ? this.highlightKeyword(label, labelPart) : label
        return index === 0 ? node : [` ${this.separator} `, node]
      })
    },
    highlightKeyword (label, keyword) {
      const h = this._c
      return label.split(keyword)
        .map((node, index) => index === 0 ? node : [
          h('span', { class: { 'ods-cascader-menu__item__keyword': true } }, [this._v(keyword)]),
          node
        ])
    },
    flattenOptions (options, ancestor = []) {
      let flatOptions = []
      options.forEach((option) => {
        const optionsStack = ancestor.concat(option)
        if (!option[this.childrenKey]) {
          flatOptions.push(optionsStack)
        } else {
          if (this.changeOnSelect) {
            flatOptions.push(optionsStack)
          }
          flatOptions = flatOptions.concat(this.flattenOptions(option[this.childrenKey], optionsStack))
        }
      })
      return flatOptions
    },
    clearValue (ev) {
      ev.stopPropagation()
      this.handlePick([], true)
    },
    handleClickoutside (pickFinished = false) {
      if (this.menuVisible && !pickFinished) {
        this.needFocus = false
      }
      this.menuVisible = false
    },
    handleClick () {
      if (this.cascaderDisabled) return
      this.$refs.input.focus()
      if (this.filterable) {
        this.menuVisible = true
        return
      }
      this.menuVisible = !this.menuVisible
    },
    handleFocus (event) {
      this.$emit('focus', event)
    },
    handleBlur (event) {
      this.$emit('blur', event)
    },
    handleComposition (event) {
      this.isOnComposition = event.type !== 'compositionend'
    }
  },

  created () {
    this.debouncedInputChange = debounce(this.debounce, value => {
      const before = this.beforeFilter(value)

      if (before && before.then) {
        this.menu.options = [{
          __IS__FLAT__OPTIONS: true,
          label: this.t('el.cascader.loading'),
          value: '',
          disabled: true
        }]
        before
          .then(() => {
            this.$nextTick(() => {
              this.handleInputChange(value)
            })
          })
      } else if (before !== false) {
        this.$nextTick(() => {
          this.handleInputChange(value)
        })
      }
    })
  },

  mounted () {
    this.flatOptions = this.flattenOptions(this.options)
  }
}
</script>
