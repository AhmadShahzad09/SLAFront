<template>
  <div
    data-name="OdsRate"
    class="ods-rate"
    @keydown="handleKey"
    role="slider"
    :aria-valuenow="currentValue"
    :aria-valuetext="text"
    aria-valuemin="0"
    :aria-valuemax="max"
    tabindex="0">
    <span
      v-for="(item, key) in max"
      class="ods-rate__item"
      @mousemove="setCurrentValue(item, $event)"
      @mouseleave="resetCurrentValue"
      @click="selectValue(item)"
      :style="{ cursor: rateDisabled ? 'auto' : 'pointer' }"
      :key="key">
      <span
        :class="[classes[item - 1], { 'hover': hoverIndex === item }]"
        class="ods-rate__icon"
        :style="getIconStyle(item)">
        <span
          v-if="showDecimalIcon(item)"
          :class="decimalIconClass"
          :style="decimalStyle"
          class="ods-rate__decimal">
        </span>
      </span>
    </span>
    <span v-if="showText || showScore" class="ods-rate__text" :style="{ color: textColor }">{{ text }}</span>
  </div>
</template>

<script>

import { hasClass } from '@/addons/utils/dom'
import { isObject } from '@/addons/utils/types'
import Migrating from '@/addons/mixins/migrating'
import cssVars from '@/components/theme-onesait/common/var.scss'

export default {
  name: 'OdsRate',
  version: '2.0.0',
  category: 'form',
  lastDate: '13/04/2020',
  syncStatus: 'aligned-extended',

  mixins: [Migrating],

  inject: {
    odsForm: {
      default: ''
    }
  },

  data () {
    return {
      pointerAtLeftHalf: true,
      currentValue: this.value,
      hoverIndex: -1
    }
  },

  props: {
    value: {
      type: Number,
      default: 0
    },
    lowThreshold: {
      type: Number,
      default: 2
    },
    highThreshold: {
      type: Number,
      default: 4
    },
    max: {
      type: Number,
      default: 5
    },
    colors: {
      type: [Array, Object],
      default () {
        return [cssVars.ratingDefaultColor, cssVars.ratingDefaultColor, cssVars.ratingDefaultColor]
      }
    },
    voidColor: {
      type: String,
      default: cssVars.rateVoidColor
    },
    disabledVoidColor: {
      type: String,
      default: cssVars.rateDisableColor
    },
    iconClasses: {
      type: Array,
      default () {
        return ['ods-icon-star-on', 'ods-icon-star-on', 'ods-icon-star-on']
      }
    },
    voidIconClass: {
      type: String,
      default: 'ods-icon-star-off'
    },
    disabledVoidIconClass: {
      type: String,
      default: 'ods-icon-star-on'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowHalf: {
      type: Boolean,
      default: false
    },
    showText: {
      type: Boolean,
      default: false
    },
    showScore: {
      type: Boolean,
      default: false
    },
    textColor: {
      type: String,
      default: cssVars.rateTextColor
    },
    texts: {
      type: Array,
      default () {
        return ['muy mal', 'mal', 'regular', 'bien', 'muy bien']
      }
    },
    scoreTemplate: {
      type: String,
      default: '{value}'
    }
  },

  computed: {
    text () {
      let result = ''
      if (this.showScore) {
        result = this.scoreTemplate.replace(/\{\s*value\s*\}/, this.rateDisabled
          ? this.value
          : this.currentValue)
      } else if (this.showText) {
        result = this.texts[Math.ceil(this.currentValue) - 1]
      }
      return result
    },

    decimalStyle () {
      let width = ''
      if (this.rateDisabled) {
        width = `${this.valueDecimal}%`
      } else if (this.allowHalf) {
        width = '50%'
      }
      return {
        color: this.activeColor,
        width
      }
    },

    valueDecimal () {
      return this.value * 100 - Math.floor(this.value) * 100
    },

    classMap () {
      return Array.isArray(this.iconClasses)
        ? {
          [this.lowThreshold]: this.iconClasses[0],
          [this.highThreshold]: { value: this.iconClasses[1], excluded: true },
          [this.max]: this.iconClasses[2]
        } : this.iconClasses
    },

    decimalIconClass () {
      return this.getValueFromMap(this.value, this.classMap)
    },

    voidClass () {
      return this.rateDisabled ? this.disabledVoidIconClass : this.voidIconClass
    },

    activeClass () {
      return this.getValueFromMap(this.currentValue, this.classMap)
    },

    colorMap () {
      return Array.isArray(this.colors)
        ? {
          [this.lowThreshold]: this.colors[0],
          [this.highThreshold]: { value: this.colors[1], excluded: true },
          [this.max]: this.colors[2]
        } : this.colors
    },

    activeColor () {
      return this.getValueFromMap(this.currentValue, this.colorMap)
    },

    classes () {
      let result = []
      let i = 0
      let threshold = this.currentValue
      if (this.allowHalf && this.currentValue !== Math.floor(this.currentValue)) {
        threshold--
      }
      for (; i < threshold; i++) {
        result.push(this.activeClass)
      }
      for (; i < this.max; i++) {
        result.push(this.voidClass)
      }
      return result
    },

    rateDisabled () {
      return this.disabled || (this.odsForm || {}).disabled
    }
  },

  watch: {
    value (val) {
      this.currentValue = val
      this.pointerAtLeftHalf = this.value !== Math.floor(this.value)
    }
  },

  methods: {
    getMigratingConfig () {
      return {
        props: {
          'text-template': 'text-template is renamed to score-template.'
        }
      }
    },

    getValueFromMap (value, map) {
      const matchedKeys = Object.keys(map)
        .filter(key => {
          const val = map[key]
          const excluded = isObject(val) ? val.excluded : false
          return excluded ? value < key : value <= key
        })
        .sort((a, b) => a - b)
      const matchedValue = map[matchedKeys[0]]
      return isObject(matchedValue) ? matchedValue.value : (matchedValue || '')
    },

    showDecimalIcon (item) {
      let showWhenDisabled = this.rateDisabled && this.valueDecimal > 0 && item - 1 < this.value && item > this.value
      /* istanbul ignore next */
      let showWhenAllowHalf = this.allowHalf &&
          this.pointerAtLeftHalf &&
          item - 0.5 <= this.currentValue &&
          item > this.currentValue
      return showWhenDisabled || showWhenAllowHalf
    },

    getIconStyle (item) {
      const voidColor = this.rateDisabled ? this.disabledVoidColor : this.voidColor
      return {
        color: item <= this.currentValue ? this.activeColor : voidColor
      }
    },

    selectValue (value) {
      if (this.rateDisabled) {
        return
      }
      if (this.allowHalf && this.pointerAtLeftHalf) {
        this.$emit('input', this.currentValue)
        this.$emit('change', this.currentValue)
      } else {
        this.$emit('input', value)
        this.$emit('change', value)
      }
    },

    handleKey (e) {
      if (this.rateDisabled) {
        return
      }
      let currentValue = this.currentValue
      const keyCode = e.keyCode
      if (keyCode === 38 || keyCode === 39) { // left / down
        if (this.allowHalf) {
          currentValue += 0.5
        } else {
          currentValue += 1
        }
        e.stopPropagation()
        e.preventDefault()
      } else if (keyCode === 37 || keyCode === 40) {
        if (this.allowHalf) {
          currentValue -= 0.5
        } else {
          currentValue -= 1
        }
        e.stopPropagation()
        e.preventDefault()
      }
      currentValue = currentValue < 0 ? 0 : currentValue
      currentValue = currentValue > this.max ? this.max : currentValue

      this.$emit('input', currentValue)
      this.$emit('change', currentValue)
    },

    setCurrentValue (value, event) {
      if (this.rateDisabled) {
        return
      }
      /* istanbul ignore if */
      if (this.allowHalf) {
        let target = event.target
        if (hasClass(target, 'ods-rate__item')) {
          target = target.querySelector('.ods-rate__icon')
        }
        if (hasClass(target, 'ods-rate__decimal')) {
          target = target.parentNode
        }
        this.pointerAtLeftHalf = event.offsetX * 2 <= target.clientWidth
        this.currentValue = this.pointerAtLeftHalf ? value - 0.5 : value
      } else {
        this.currentValue = value
      }
      this.hoverIndex = value
    },

    resetCurrentValue () {
      if (this.rateDisabled) {
        return
      }
      if (this.allowHalf) {
        this.pointerAtLeftHalf = this.value !== Math.floor(this.value)
      }
      this.currentValue = this.value
      this.hoverIndex = -1
    }
  },

  created () {
    if (!this.value) {
      this.$emit('input', 0)
    }
  }
}
</script>
