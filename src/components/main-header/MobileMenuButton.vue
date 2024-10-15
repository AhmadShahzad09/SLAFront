<template>
  <div
    class="mobile-menu__button"
    @click="toggleMenu">
    <span class="mobile-menu__line"></span>
    <span class="mobile-menu__line"></span>
    <span class="mobile-menu__line"></span>
  </div>
</template>

<script>
import EventBus from './event-bus'
export default {
  name: 'MobileMenuButton',
  methods: {
    toggleMenu () {
      EventBus.$emit('toggleMenu')
    }
  }
}
</script>
