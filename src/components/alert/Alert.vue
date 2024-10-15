<template>
  <transition name="ods-alert-fade">
    <div
      data-name="OdsAlert"
      class="ods-alert"
      :class="[typeClass, center ? 'is-center' : '', 'is-' + effect]"
      v-show="visible"
      role="alert"
      :style="{'max-width': width ? width + 'px' : '100%'}"
    >
      <span class="ods-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></span>
      <div class="ods-alert__content">
        <span class="ods-alert__title" :class="[ isBoldTitle ]" v-if="title || $slots.title">
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="ods-alert__description" v-if="$slots.default && !description"><slot></slot></p>
        <p class="ods-alert__description" v-if="description && !$slots.default">{{ description }}</p>
        <span class="ods-alert__closebtn" :class="{ 'is-customed': closeText !== '', 'ods-icon-close': closeText === '' }" v-show="closable" @click="close()">{{closeText}}</span>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">

/**
 * @description <p>Alert component, <a href="https://lab.onesaitplatform.com/web/ods-storybook/?path=/story/components-alert--success">see and test it here</a>.</p>
 * @module Alert
 * @category Components
 *
 * @vue-prop {String} [title=''] Alert title
 * @vue-prop {String} [description=''] Alert main text
 * @vue-prop {String} [type=info] Define alert color and icon
 * @vue-prop {Boolean} [closable=true] If it's true allow you to hide the alert
 * @vue-prop {String} [closeText=''] Allow you to replace closable X with a string
 * @vue-prop {String} [width=''] Width of alert box
 * @vue-prop {Boolean} [showIcon] If it's true show the icon
 * @vue-prop {Boolean} [center] If it's true the text is located in the center of the alert box
 * @vue-prop {String} [effect=ligth] Define the look of the alert box, ligth or dark
 *
 * @vue-data {Boolean} visible - If it's true show the alert
 *
 * @vue-computed {String} typeClass - Return a class that define alert color and icon
 * @vue-computed {String} iconClass - Return a class that define alert icon
 * @vue-computed {String} isBigIcon - Return a class that define the width of icon box
 * @vue-computed {String} isBoldTitle - Return a class that define if title is bold or not
 *
 * @vue-event {String} close - Emit 'close' string when close button is pressed
 */

const TYPE_CLASSES_MAP = {
  'success': 'ods-icon-checkmark-2',
  'warning': 'ods-icon-warning',
  'error': 'ods-icon-close'
}
export default {
  name: 'OdsAlert',
  version: '2.0.0',
  category: 'notification',
  lastDate: '13/04/2020',
  syncStatus: 'aligned',
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info'
    },
    closable: {
      type: Boolean,
      default: true
    },
    closeText: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    },
    showIcon: Boolean,
    center: Boolean,
    effect: {
      type: String,
      default: 'light',
      validator: function (value) {
        return ['light', 'dark'].indexOf(value) !== -1
      }
    }
  },

  data () {
    return {
      visible: true
    }
  },

  methods: {

    /**
     * @description Called when close button is pressed, set visible data to false
     * @returns {void}
     */

    close () {
      this.visible = false
      this.$emit('close')
    }
  },

  computed: {
    typeClass () {
      return `ods-alert--${this.type}`
    },

    iconClass () {
      return TYPE_CLASSES_MAP[this.type] || 'ods-icon-info'
    },

    isBigIcon () {
      return this.description || this.$slots.default ? 'is-big' : ''
    },

    isBoldTitle () {
      return this.description || this.$slots.default ? 'is-bold' : ''
    }
  }
}
</script>
