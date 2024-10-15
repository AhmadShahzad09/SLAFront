<template>
  <div
    class="ods-main-header__wrapper">
    <div
    @click="navigateTo"
    class="ods-main-header__logo">
      <div class="logo__dimension">
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 36">
          <title>onesite-dimension-main-header</title>
          <path style="fill: #193b47" id="Fill-1" class="cls-1" d="M0,0V36l20-5.82V5.82ZM1.8,2.4L18.2,7.17V28.82L1.8,33.6V2.4Z" transform="translate(0 0)"/>
        </svg>
      </div>
      <div class="logo_text">
        <h2 v-html="text"></h2>
      </div>
    </div>
      <ods-actions-menu
        v-if="showSuitesMenu && !hide"
        class="ods-main-header-actions__suite"
        customClass="ods-main-header-actions__suite-popover"
        icon="app"
        popoverPosition="bottom-start"
        mobilePopoverPosition="bottom-end"
        mobileWidth="240"
        :offSet="isMobile ? 8 : 0"
        boundariesElement=".ods-main-header">
        <slot/>
      </ods-actions-menu>
  </div>
</template>

<script>
import EventBus from './event-bus'
import OdsActionsMenu from '@/components/actions-menu/ActionsMenu'

export default {
  name: 'MainHeaderLogo',
  components: {
    OdsActionsMenu
  },
  data () {
    return {
      text: '',
      to: '',
      showSuitesMenu: false,
      isMobile: false
    }
  },

  props: {
    hide: {
      type: Boolean
    }
  },

  methods: {
    navigateTo () {
      if (this.$router && !this.to.includes('http')) {
        this.$router.push(this.to)
      } else {
        window.open(this.to)
      }
    }
  },
  mounted () {
    this.$nextTick(_ => {
      this.to = EventBus.logoUrl
      this.showSuitesMenu = EventBus.showSuitesMenu
      this.isMobile = EventBus.isMobile
      this.text = EventBus.logoText
    })
  }
}
</script>
