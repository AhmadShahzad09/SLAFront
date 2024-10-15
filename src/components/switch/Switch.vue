<template>
  <div
    data-name="OdsSwitch"
    class="ods-switch"
    :class="{ 'is-disabled': switchDisabled, 'is-checked': checked }"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="switchDisabled"
    @click="switchValue">
    <label
      v-if="labelText && id"
      :for="id"
      class="ods-form-item__label ods-form-item__label--switch">
      {{ labelText }}
    </label>
    <input
      class="ods-switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :id="id"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      @keydown.enter="switchValue">
    <div class="ods-switch__wrapper">
      <span
        :class="['ods-switch__label', 'ods-switch__label--left', !checked ? 'is-active' : '']"
        v-if="inactiveIconClass || inactiveText">
        <span :class="[inactiveIconClass]" v-if="inactiveIconClass"></span>
        <span v-if="!inactiveIconClass && inactiveText" :aria-hidden="checked">{{ inactiveText }}</span>
      </span>
      <span class="ods-switch__core" ref="core" :style="{ 'width': coreWidth + 'px' }">
      </span>
      <span
        :class="['ods-switch__label', 'ods-switch__label--right', checked ? 'is-active' : '']"
        v-if="activeIconClass || activeText">
        <span :class="[activeIconClass]" v-if="activeIconClass"></span>
        <span v-if="!activeIconClass && activeText" :aria-hidden="!checked">{{ activeText }}</span>
      </span>
    </div>
  </div>
</template>
<script>
import emitter from '@/addons/mixins/emitter'
import Focus from '@/addons/mixins/focus'
import Migrating from '@/addons/mixins/migrating'

export default {
  name: 'OdsSwitch',
  version: '2.0.0',
  category: 'form',
  lastDate: '13/04/2020',
  syncStatus: 'aligned-extended',
  mixins: [Focus('input'), Migrating, emitter],
  inject: {
    odsForm: {
      default: ''
    }
  },
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 40
    },
    activeIconClass: {
      type: String,
      default: ''
    },
    inactiveIconClass: {
      type: String,
      default: ''
    },
    activeText: String,
    inactiveText: String,
    activeColor: {
      type: String,
      default: ''
    },
    inactiveColor: {
      type: String,
      default: ''
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    id: String,
    labelText: String
  },
  data () {
    return {
      coreWidth: this.width
    }
  },
  created () {
    if (!~[this.activeValue, this.inactiveValue].indexOf(this.value)) {
      this.$emit('input', this.inactiveValue)
    }
  },
  computed: {
    checked () {
      return this.value === this.activeValue
    },
    switchDisabled () {
      return this.disabled || (this.odsForm || {}).disabled
    }
  },
  watch: {
    checked () {
      this.$refs.input.checked = this.checked
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor()
      }
      if (this.validateEvent) {
        this.dispatch('OdsFormItem', 'el.form.change', [this.value])
      }
    }
  },
  methods: {
    handleChange (event) {
      const val = this.checked ? this.inactiveValue : this.activeValue
      this.$emit('input', val)
      this.$emit('change', val)
      this.$nextTick(() => {
        // set input's checked property
        // in case parent refuses to change component's value
        this.$refs.input.checked = this.checked
      })
    },
    setBackgroundColor () {
      let newColor = this.checked ? this.activeColor : this.inactiveColor
      this.$refs.core.style.borderColor = newColor
      this.$refs.core.style.backgroundColor = newColor
    },
    switchValue () {
      !this.switchDisabled && this.handleChange()
    },
    getMigratingConfig () {
      return {
        props: {
          'on-color': 'on-color is renamed to active-color.',
          'off-color': 'off-color is renamed to inactive-color.',
          'on-text': 'on-text is renamed to active-text.',
          'off-text': 'off-text is renamed to inactive-text.',
          'on-value': 'on-value is renamed to active-value.',
          'off-value': 'off-value is renamed to inactive-value.',
          'on-icon-class': 'on-icon-class is renamed to active-icon-class.',
          'off-icon-class': 'off-icon-class is renamed to inactive-icon-class.'
        }
      }
    }
  },
  mounted () {
    /* istanbul ignore if */
    this.coreWidth = this.width || 40
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor()
    }
    this.$refs.input.checked = this.checked
  }
}
</script>
