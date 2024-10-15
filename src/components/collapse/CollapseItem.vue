<template>
  <div class="ods-collapse-item" :class="{'is-active': isActive}">
    <div
      role="tab"
      :aria-expanded="isActive"
      :aria-controls="`ods-collapse-content-${id}`"
      :aria-describedby ="`ods-collapse-content-${id}`"
    >
      <div
        class="ods-collapse-item__header"
        @click="handleHeaderClick"
        role="button"
        :id="`ods-collapse-head-${id}`"
        tabindex="0"
        @keyup.space.enter.stop="handleEnterClick"
        :class="{
          'focusing': focusing,
          'is-active': isActive
        }"
        @focus="handleFocus"
        @blur="focusing = false"
      >
        <slot name="title">{{title}}</slot>
        <i
          class="ods-collapse-item__arrow ods-icon-arrow-up"
          :class="{'is-active': isActive}">
        </i>
      </div>
    </div>
    <ods-collapse-transition>
      <div
        class="ods-collapse-item__wrap"
        v-show="isActive"
        role="tabpanel"
        :aria-hidden="!isActive"
        :aria-labelledby="`ods-collapse-head-${id}`"
        :id="`ods-collapse-content-${id}`"
      >
        <div class="ods-collapse-item__content">
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
  name: 'OdsCollapseItem',

  componentName: 'OdsCollapseItem',

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
      isClick: false
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
    }
  },

  computed: {
    isActive () {
      return this.collapse.activeNames.indexOf(this.name) > -1
    },
    id () {
      return generateId()
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
      this.dispatch('OdsCollapse', 'item-click', this)
      this.focusing = false
      this.isClick = true
    },
    handleEnterClick () {
      this.dispatch('OdsCollapse', 'item-click', this)
    }
  }
}
</script>
