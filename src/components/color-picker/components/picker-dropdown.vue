<template>
  <transition name="ods-zoom-in-top" @after-leave="doDestroy">
    <div
      class="ods-color-dropdown"
      v-show="showPopper">
      <div class="ods-color-dropdown__main-wrapper">
        <hue-slider ref="hue" :color="color" vertical style="float: right;"></hue-slider>
        <sv-panel ref="sl" :color="color"></sv-panel>
      </div>
      <alpha-slider v-if="showAlpha" ref="alpha" :color="color"></alpha-slider>
      <predefine v-if="predefine" :color="color" :colors="predefine"></predefine>
      <div class="ods-color-dropdown__btns">
        <span class="ods-color-dropdown__value">
          <ods-input
            v-model="customInput"
            @keyup.native.enter="handleConfirm"
            @blur="handleConfirm"
            :validate-event="false"
            size="mini">
          </ods-input>
        </span>
        <ods-button
          size="mini"
          type="text"
          class="ods-color-dropdown__link-btn"
          @click="$emit('clear')">
          {{ t('el.colorpicker.clear') }}
        </ods-button>
        <ods-button
          plain
          size="mini"
          class="ods-color-dropdown__btn"
          @click="confirmValue">
          {{ t('el.colorpicker.confirm') }}
        </ods-button>
      </div>
    </div>
  </transition>
</template>

<script>
import SvPanel from './sv-panel'
import HueSlider from './hue-slider'
import AlphaSlider from './alpha-slider'
import Predefine from './predefine'
import Popper from '@/addons/utils/vue-popper'
import Locale from '@/addons/mixins/locale'
import OdsInput from '@/components/input/Input'
import OdsButton from '@/components/button/Button'

export default {
  name: 'ods-color-picker-dropdown',

  mixins: [Popper, Locale],

  components: {
    SvPanel,
    HueSlider,
    AlphaSlider,
    OdsInput,
    OdsButton,
    Predefine
  },

  props: {
    color: {
      required: true
    },
    showAlpha: Boolean,
    predefine: Array
  },

  data () {
    return {
      customInput: ''
    }
  },

  computed: {
    currentColor () {
      const parent = this.$parent
      return !parent.value && !parent.showPanelColor ? '' : parent.color.value
    }
  },

  methods: {
    confirmValue () {
      this.$emit('pick')
    },

    handleConfirm () {
      this.color.fromString(this.customInput)
    }
  },

  mounted () {
    this.$parent.popperElm = this.popperElm = this.$el
    this.referenceElm = this.$parent.$el
  },

  watch: {
    showPopper (val) {
      if (val === true) {
        this.$nextTick(() => {
          const { sl, hue, alpha } = this.$refs
          sl && sl.update()
          hue && hue.update()
          alpha && alpha.update()
        })
      }
    },

    currentColor: {
      immediate: true,
      handler (val) {
        this.customInput = val
      }
    }
  }
}
</script>
