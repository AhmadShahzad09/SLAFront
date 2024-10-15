<template>
<div>
  <slot/>
</div>
</template>

<script>
import OdsActionsMenu from '@/components/actions-menu/ActionsMenu'
import { setTimeout } from 'timers'

export default {
  name: 'MainHeaderNotifications',
  components: {
    OdsActionsMenu
  },

  props: {
    isPhone: {
      type: Boolean
    }
  },

  methods: {
    showMobileOverlay () {
      if (this.isPhone) {
        const overlay = document.createElement('div')
        overlay.className = 'mobile-overlay'
        document.querySelector('body').appendChild(overlay)
        setTimeout(_ => overlay.classList.add('mobile-overlay--visible'), 0)
      }
    },
    hideMobileOverlay () {
      if (this.isPhone) {
        const overlay = document.querySelector('.mobile-overlay')
        overlay.classList.remove('mobile-overlay--visible')
        overlay.classList.add('mobile-overlay--hidden')
        setTimeout(_ => overlay.remove(), 120)
      }
    }
  }
}
</script>
