<template>
  <div
    data-name="OdsInputNumber"
    @dragstart.prevent
    :class="[
      'ods-input-number',
      inputNumberSize ? 'ods-input-number--' + inputNumberSize : '',
      { 'readonly': readonly },
      { 'is-disabled': inputNumberDisabled },
      { 'is-without-controls': !controls },
      { 'is-controls-right': controlsAtRight }
    ]">
    <span
      class="ods-input-number__decrease"
      role="button"
      v-if="controls"
      v-repeat-click="decrease"
      :class="{'is-disabled': minDisabled}"
      @keydown.enter="decrease">
      <i :class="`ods-icon-${controlsAtRight ? 'arrow-down' : 'minus'}`"></i>
    </span>
    <span
      class="ods-input-number__increase"
      role="button"
      v-if="controls"
      v-repeat-click="increase"
      :class="{'is-disabled': maxDisabled}"
      @keydown.enter="increase">
      <i :class="`ods-icon-${controlsAtRight ? 'arrow-up' : 'plus'}`"></i>
    </span>
    <ods-input
      type="text"
      ref="input"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="inputNumberDisabled"
      :size="inputNumberSize"
      :max="max"
      :min="min"
      :name="name"
      :label="label"
      :isWhite="isWhite"
      :readonly="readonly"
      @keydown.up.native.prevent="increase"
      @keydown.down.native.prevent="decrease"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      @change="handleInputChange">
    </ods-input>
  </div>
</template>
<script>
import OdsInput from '@/components/input/Input'
import Focus from '@/addons/mixins/focus'
import RepeatClick from '@/addons/directives/repeat-click'

export default {
  name: 'OdsInputNumber',
  version: '2.0.6',
  category: 'form',
  lastDate: '11/09/2020',
  syncStatus: 'aligned-extended',
  mixins: [Focus('input')],
  inject: {
    odsForm: {
      default: ''
    },
    odsFormItem: {
      default: ''
    }
  },
  directives: {
    repeatClick: RepeatClick
  },
  components: {
    OdsInput
  },
  props: {
    step: {
      type: Number,
      default: 1
    },
    stepStrictly: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    value: {},
    disabled: Boolean,
    size: {
      type: String,
      default: 'deci'
    },
    controls: {
      type: Boolean,
      default: true
    },
    controlsPosition: {
      type: String,
      default: 'right'
    },
    name: String,
    label: String,
    placeholder: String,
    precision: {
      type: Number,
      validator (val) {
        return val >= 0 && val === parseInt(val, 10)
      }
    },
    localeFormat: {
      type: String,
      default: 'es-ES'
    },
    localeOptions: {
      type: Object,
      default: function () {
        return { }
      }
    },
    zeroEmpty: {
      type: Boolean,
      default: false
    },
    isWhite: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentValue: null,
      userInput: null
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (value, oldValue) {
        let newVal = value === undefined ? value : parseFloat(value)
        if (newVal !== undefined) {
          if (isNaN(newVal)) {
            return
          }

          if (this.stepStrictly) {
            const stepPrecision = this.getPrecision(this.step)
            const precisionFactor = Math.pow(10, stepPrecision)
            newVal = Math.round(newVal / this.step) * precisionFactor * this.step / precisionFactor
          }

          if (this.precision !== undefined) {
            newVal = this.toPrecision(newVal, this.precision)
          }
        }
        if (newVal >= this.max) newVal = this.max
        if (newVal <= this.min) newVal = this.min
        this.currentValue = newVal
        this.userInput = null
        this.$emit('input', newVal)
      }
    }
  },
  computed: {
    minDisabled () {
      return this._decrease(this.value, this.step) < this.min
    },
    maxDisabled () {
      return this._increase(this.value, this.step) > this.max
    },
    numPrecision () {
      const { value, step, getPrecision, precision } = this
      const stepPrecision = getPrecision(step)
      if (precision !== undefined) {
        if (stepPrecision > precision) {
          console.warn('[OnesaitDS Warn][InputNumber]precision should not be less than the decimal places of step')
        }
        return precision
      } else {
        return Math.max(getPrecision(value), stepPrecision)
      }
    },
    controlsAtRight () {
      return this.controls && this.controlsPosition === 'right'
    },
    _odsFormItemSize () {
      return (this.odsFormItem || {}).odsFormItemSize
    },
    inputNumberSize () {
      return this.size || this._odsFormItemSize || (this.$ONESAITDS || {}).size
    },
    inputNumberDisabled () {
      return this.disabled || (this.odsForm || {}).disabled
    },
    displayValue () {
      if (this.userInput !== null) {
        return this.userInput
      }

      let currentValue = this.currentValue

      if (typeof currentValue === 'number') {
        if (this.stepStrictly) {
          const stepPrecision = this.getPrecision(this.step)
          const precisionFactor = Math.pow(10, stepPrecision)
          currentValue = Math.round(currentValue / this.step) * precisionFactor * this.step / precisionFactor
        }

        if (this.precision !== undefined) {
          currentValue = currentValue.toFixed(this.precision)
        }
      }
      return !currentValue ? currentValue : Number(currentValue).toString()
    }
  },
  methods: {

    toPrecision (num, precision) {
      if (precision === undefined) precision = this.numPrecision
      return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision))
    },
    getPrecision (value) {
      if (value === undefined) return 0
      const valueString = value.toString()
      const dotPosition = valueString.indexOf('.')
      let precision = 0
      if (dotPosition !== -1) {
        precision = valueString.length - dotPosition - 1
      }
      return precision
    },
    _increase (val, step) {
      if (typeof val !== 'number' && val !== undefined) return this.currentValue

      const precisionFactor = Math.pow(10, this.numPrecision)
      // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
      return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor)
    },
    _decrease (val, step) {
      if (typeof val !== 'number' && val !== undefined) return this.currentValue

      const precisionFactor = Math.pow(10, this.numPrecision)

      return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor)
    },
    increase () {
      if (this.inputNumberDisabled || this.maxDisabled) return
      const value = this.value || 0
      const newVal = this._increase(value, this.step)
      this.setCurrentValue(newVal)
    },
    decrease () {
      if (this.inputNumberDisabled || this.minDisabled) return
      const value = this.value || 0
      const newVal = this._decrease(value, this.step)
      this.setCurrentValue(newVal)
    },
    handleBlur (event) {
      this.$emit('blur', event)
    },
    handleFocus (event) {
      this.$emit('focus', event)
    },
    setCurrentValue (newVal) {
      const oldVal = this.currentValue
      if (typeof newVal === 'number' && this.precision !== undefined) {
        newVal = this.toPrecision(newVal, this.precision)
      }
      if (newVal >= this.max) newVal = this.max
      if (newVal <= this.min) newVal = this.min
      if (oldVal === newVal) return
      this.userInput = null
      this.$emit('input', newVal)
      this.$emit('change', newVal, oldVal)
      this.currentValue = newVal
    },
    handleInput (value) {
      value = value.replace(/[a-zA-Z]/g, '')
      if (value.includes(',')) {
        value = value.replace(',', '.')
      }
      // if (value === '.') return
      this.userInput = value
    },
    handleInputChange (value) {
      const newVal = value === '' ? undefined : Number(value)
      if (!isNaN(newVal) || value === '') {
        this.setCurrentValue(newVal)
      }
      this.userInput = null
    },
    select () {
      this.$refs.input.select()
    }
  },
  mounted () {
    const innerInput = this.$refs.input.$refs.input
    innerInput.setAttribute('role', 'spinbutton')
    innerInput.setAttribute('aria-valuemax', this.max)
    innerInput.setAttribute('aria-valuemin', this.min)
    innerInput.setAttribute('aria-valuenow', this.currentValue)
    innerInput.setAttribute('aria-disabled', this.inputNumberDisabled)
  },
  updated () {
    if (!this.$refs || !this.$refs.input) return
    const innerInput = this.$refs.input.$refs.input
    innerInput.setAttribute('aria-valuenow', this.currentValue)
  }
}
</script>
