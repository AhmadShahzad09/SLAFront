<template>
  <button
    data-name="OdsButton"
    class="ods-button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'ods-button--' + type : '',
      buttonSize ? 'ods-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
        'is-negative': negative,
        'is-transparent': transparent,
        'is-full': full
      }
    ]"
  >
    <i class="ods-icon-loading" v-if="loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
    <i :class="icon" v-if="icon && !loading"></i>
  </button>
</template>
<script>

/**
 * @description <p>Button component, <a href="https://lab.onesaitplatform.com/web/ods-storybook/?path=/story/components-button--primary">see and test it here</a>.</p>
 * @module Button
 * @category Components
 *
 * @vue-prop {String} [type=primary] Button color
 * @vue-prop {String} [size] Button size
 * @vue-prop {String} [icon=''] Button icon
 * @vue-prop {String} [nativeTye=button] Button type attribute
 * @vue-prop {Boolean} [loading] If it's true show the loading spinner
 * @vue-prop {Boolean} [disabled] If it's true the button is disabled
 * @vue-prop {Boolean} [plain] If it's true add class is-plain to the button
 * @vue-prop {Boolean} [autofocus] If it's true add autofocus attribute to the button
 * @vue-prop {Boolean} [round=true] If it's true add class is-round to the button
 * @vue-prop {Boolean} [circle] If it's true add class is-circle to the button
 * @vue-prop {Boolean} [negative] If it's true button colors are reversed
 * @vue-prop {Boolean} [transparent] If it's true add class is-transparent to the button
 * @vue-prop {Boolean} [full] If it's true button covers the entire width of his container
 *
 * @vue-computed {String} [_odsFormItemSize] - Return form item size where button is inserted
 * @vue-computed {String} [buttonSize] - Return button size
 * @vue-computed {Boolean} [buttonDisabled] - Return if button is disabled, check also if the form where is inserted is disabled or not
 *
 * @vue-event {String} handleClick - Emit the argument of the event click
 */

export default {
  name: 'OdsButton',
  version: '2.0.2',
  category: 'form',
  lastDate: '02/10/2020',
  syncStatus: 'aligned-extended',
  inject: {
    odsForm: {
      default: ''
    },
    odsFormItem: {
      default: ''
    }
  },

  props: {
    type: {
      type: String,
      default: 'primary'
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: {
      type: Boolean,
      default: true
    },
    circle: Boolean,
    negative: Boolean,
    transparent: Boolean,
    full: Boolean
  },

  computed: {
    _odsFormItemSize () {
      return (this.odsFormItem || {}).odsFormItemSize
    },
    buttonSize () {
      return this.size || this._odsFormItemSize || (this.$ONESAITDS || {}).size
    },
    buttonDisabled () {
      return this.disabled || (this.odsForm || {}).disabled
    }
  },

  methods: {

    /**
     * @description Emit the argument of the event click
     * @param {Object} evt - Argument of the event click
     * @returns {void}
     */

    handleClick (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>
