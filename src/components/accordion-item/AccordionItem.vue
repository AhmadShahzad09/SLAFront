<template>
  <div class="ods-accordion-item"
    :class="{'is-active': isActive, 'is-disabled': disabled }">
    <div
      role="tab"
      :aria-expanded="isActive"
      :aria-controls="`ods-accordion-content-${id}`"
      :aria-describedby ="`ods-accordion-content-${id}`"
    >
      <div
        class="ods-accordion-item__header"
        @click="handleHeaderClick"
        role="button"
        :id="`ods-accordion-head-${id}`"
        :tabindex="disabled ? undefined : 0"
        @keyup.space.enter.stop="handleEnterClick"
        :class="{
          'focusing': focusing,
          'is-active': isActive
        }"
        @focus="handleFocus"
        @blur="focusing = false"
      >
        <div class="ods-accordion-item__title">
          <slot name="title">{{title}}</slot>
        </div>
         <span
          class="ods-accordion-item__arrow ods-icon-arrow-down"
          :class="{'is-active': isActive}">
        </span>
      </div>
    </div>
    <ods-collapse-transition>
      <div
        class="ods-accordion-item__wrap"
        v-show="isActive"
        role="tabpanel"
        :aria-hidden="!isActive"
        :aria-labelledby="`ods-accordion-head-${id}`"
        :id="`ods-accordion-content-${id}`"
      >
        <div class="ods-accordion-item__content">
          <slot></slot>
        </div>
      </div>
    </ods-collapse-transition>
  </div>
</template>
<script>
import OdsCollapseTransition from '@/addons/transitions/collapse-transition'
import Emitter from '@/addons/mixins/emitter'
import { generateId } from '@/addons/utils/util'

export default {
  name: 'OdsAccordionItem',

  componentName: 'OdsAccordionItem',

  mixins: [Emitter],

  components: { OdsCollapseTransition },

  data () {
    return {
      contentWrapStyle: {
        height: 'auto',
        display: 'block'
      },
      contentHeight: 0,
      focusing: false,
      isClick: false,
      id: generateId()
    }
  },

  inject: ['collapse'],

  props: {
    title: String,
    name: {
      type: [String, Number],
      default () {
        return this._uid
      }
    },
    disabled: Boolean
  },

  computed: {
    isActive () {
      return this.collapse.activeNames.indexOf(this.name) > -1
    }
  },

  methods: {
    handleFocus () {
      setTimeout(() => {
        if (!this.isClick) {
          this.focusing = true
        } else {
          this.isClick = false
        }
      }, 50)
    },
    handleHeaderClick () {
      if (this.disabled) return
      this.dispatch('OdsAccordion', 'item-click', this)
      this.focusing = false
      this.isClick = true
    },
    handleEnterClick () {
      this.dispatch('OdsAccordion', 'item-click', this)
    }
  }
}
</script>
