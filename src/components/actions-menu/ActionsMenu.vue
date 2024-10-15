<template>
  <ods-popover
    v-model="isOpen"
    :width="mobileWidth && isMobile ? mobileWidth : width"
    :placement="mobilePopoverPosition && isMobile ? mobilePopoverPosition : popoverPosition"
    :popperClass="popoverCustomClasses"
    :visibleArrow="false"
    :popper-options="{
      boundariesElement: boundariesElement
    }"
    :offset="offSet">
    <ods-scrollbar wrapClass="ods-actions-menu__scroll-area">
      <slot/>
    </ods-scrollbar>
    <component
      :is="buttonTag"
      class="ods-actions-menu__button"
      :class="{
        'ods-actions-menu__button--active': isOpen,
        'ods-actions-menu__button--text': text,
        'ods-actions-menu__button--img': img
      }"
      :name="icon ? icon : null"
      :src="img ? img : null"
      :alt="img ? 'action menu avatar image' : null"
      slot="reference">
      <template v-if="text">{{ text }}</template>
    </component>
  </ods-popover>
</template>

<script>
import cssVars from '@/components/theme-onesait/common/var.scss'

export default {
  name: 'OdsActionsMenu',
  version: '2.0.0',
  category: 'data',
  lastDate: '13/04/2020',

  props: {
    icon: {
      type: String
    },
    text: {
      type: String
    },
    img: {
      type: String,
      default: ''
    },
    customClass: {
      type: String
    },
    width: {
      type: String,
      default: '224'
    },
    mobileWidth: {
      type: String
    },
    popoverPosition: {
      type: String,
      default: 'bottom-end'
    },
    mobilePopoverPosition: {
      type: String,
      default: 'bottom-end'
    },
    offSet: {
      type: Number,
      default: 0
    },
    onShowEvent: {
      type: Boolean,
      default: false
    },
    onHideEvent: {
      type: Boolean,
      default: false
    },
    mobileTransition: {
      type: String
    },
    boundariesElement: {
      type: String,
      default: 'body'
    }
  },
  data () {
    return {
      isOpen: false
    }
  },
  computed: {
    buttonTag () {
      if (this.icon) return 'ods-icon'
      else if (this.text) return 'span'
      else if (this.img) return 'img'
    },
    popoverCustomClasses () {
      return `
        ods-actions-menu 
        ${this.customClass ? this.customClass : ''}
        ${this.isMobile ? 'is-mobile' : ''}`
    },
    isMobile () {
      return window.matchMedia(`(max-width: ${cssVars.menuBreakpoint})`).matches
    }
  },
  watch: {
    'isOpen' () {
      if (this.onShowEvent && this.isOpen) {
        this.$emit('show')
      } else if (this.onHideEvent && !this.isOpen) {
        this.$emit('hide')
      }
    },
    '$route' () {
      this.isOpen = false
    }
  }
}
</script>
