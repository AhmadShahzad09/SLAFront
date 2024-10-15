<template>
  <li
    class="ods-dropdown-menu__item"
    :class="{
      'is-disabled': disabled,
      'ods-dropdown-menu__item--divided': divided
    }"
    @click="handleClick"
    :aria-disabled="disabled"
    :tabindex="disabled ? null : -1"
  >
    <i :class="icon" v-if="icon"></i>
    <slot></slot>
  </li>
</template>
<script>
import Emitter from '@/addons/mixins/emitter'

export default {
  name: 'OdsDropdownItem',

  mixins: [Emitter],

  props: {
    command: {},
    disabled: Boolean,
    divided: Boolean,
    icon: String
  },

  methods: {
    handleClick (e) {
      this.dispatch('OdsDropdown', 'menu-item-click', [this.command, this])
    }
  }
}
</script>
