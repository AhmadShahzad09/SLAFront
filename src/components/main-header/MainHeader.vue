<template>
  <header>
    <div
      class="ods-main-header__top-bar"
      :class="[topBarClass,
      {'ods-main-header__top-bar--bordered': topBarBorder},
      {'ods-main-header__top-bar--collapsed': topBarCollapsed}]"
      :style="{ background: topBarBackground }"
      v-if="$slots.topbar">
      <slot name="topbar"/>
      <div
        v-if="topBarClosable"
        class="top-bar__close"
        @click="handleTopBarClose">
        <span class="ods-icon-close"></span>
      </div>
    </div>
    <div
      class="ods-main-header"
      :class="{
        'ods-main-header--mobile': isMobile
      }">
      <div class="ods-main-header__inner">
        <div class="ods-main-header__inner--left">
          <mobile-menu-button
            v-if="isMobile && appHasNavigation"/>
          <main-header-logo
            v-if="!isMobile"
            class="ods-main-header__separator"
            :class="{'ods-main-header__separator--sm': showSuitesMenu}"
            :showSuitesMenu="showSuitesMenu">
            <slot name="suites"/>
          </main-header-logo>
          <main-header-breadcrumbs
            :handleWidth="handleBreadcrumbsWidth"
            :isPhone="isPhone"
            :isTablet="isTablet"
            @checkWidth="checkWidth"
            v-if="showBreadcrumbs"
            :class="[!appHasNavigation ? 'ods-pl-4' : '']"/>
        </div>
        <div class="ods-main-header__inner--right">
          <div
            v-if="environment && !isPhone"
            class="ods-main-header__environment">
            <ods-tag
              type="info"
              :class="environmentClass">{{ environment }}</ods-tag>
          </div>
          <div
            v-if="$slots.custom"
            style="margin-right:30px"
            class="ods-main-header__custom-content">
            <slot name="custom"/>
          </div>
          <main-header-notifications
            v-if="$slots.notifications"
            :isPhone="isPhone">
            <slot name="notifications"/>
          </main-header-notifications>
          <div class="ods-main-header__actions">
            <ods-actions-menu
              v-if="showActionsMenu"
              class="ods-main-header-actions__extra-actions"
              customClass="ods-main-header-actions__popover"
              :icon="actionsMenuIcon"
              boundariesElement=".ods-main-header">
              <slot name="actions"/>
            </ods-actions-menu>
            <ods-actions-menu
              v-if="showUserMenu && (!isPhone || UserMenuAlwaysOnHeader)"
              class="ods-main-header-actions__user-actions"
              :class="{'ods-main-header__separator': !isMobile && isClientLogo}"
              customClass="header-user__popover"
              :text="userMenuText"
              :img="avatarSrc"
              boundariesElement=".ods-main-header">
              <slot name="user"/>
            </ods-actions-menu>
          </div>
          <slot
            name="clientLogo"
            v-if="!isMobile"/>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import MainHeaderLogo from './MainHeaderLogo'
import MainHeaderBreadcrumbs from './MainHeaderBreadcrumbs'
import MainHeaderNotifications from './MainHeaderNotifications'
import MobileMenuButton from './MobileMenuButton'
import OdsActionsMenu from '@/components/actions-menu/ActionsMenu'
import cssVars from '@/components/theme-onesait/common/var.scss'
import EventBus from './event-bus'
import { setTimeout } from 'timers'

export default {
  name: 'OdsMainHeader',
  version: '2.0.0',
  category: 'other',
  lastDate: '13/04/2020',
  syncStatus: 'not-applicable',
  components: {
    MainHeaderLogo,
    MainHeaderBreadcrumbs,
    MainHeaderNotifications,
    OdsActionsMenu,
    MobileMenuButton
  },
  props: {
    headerLogoText: {
      type: String,
      default: 'Onesait'
    },
    logoUrl: {
      type: String,
      default: '/'
    },
    breadcrumbSeparator: {
      type: String,
      default: '>'
    },
    actionsMenuIcon: {
      type: String,
      default: 'overflow-menu'
    },
    userMenuText: {
      type: String
    },
    environment: {
      type: String
    },
    showActionsMenu: {
      type: Boolean,
      default: false
    },
    showUserMenu: {
      type: Boolean,
      default: true
    },
    showBreadcrumbs: {
      type: Boolean,
      default: true
    },
    showSuitesMenu: {
      type: Boolean,
      default: false
    },
    topBarBackground: {
      type: String,
      default: 'white'
    },
    topBarClass: {
      type: [String, Object]
    },
    topBarBorder: {
      type: Boolean,
      default: true
    },
    topBarClosable: {
      type: Boolean,
      default: false
    },
    UserMenuAlwaysOnHeader: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    environmentClass () {
      return this.environment.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '-')
    },
    isClientLogo () {
      return this.$slots.clientLogo
    },
    avatarSrc () {
      return this.userPicture
    }
  },
  methods: {
    checkOnResize () {
      this.checkIfMobile()
      this.checkIfPhone()
      this.checkWidth()
    },
    checkIfMobile () {
      this.isMobile = window.matchMedia(`(max-width: ${cssVars.menuBreakpoint})`).matches
      EventBus.isMobile = this.isMobile
    },
    checkIfPhone () {
      this.isPhone = window.matchMedia(`(max-width: ${cssVars.phoneBreakpoint})`).matches
      EventBus.isPhone = this.isPhone
      this.isTablet =
        window.matchMedia(`(min-width: ${cssVars.smBreakpoint})`).matches &&
        window.matchMedia(`(max-width: ${cssVars.menuBreakpoint})`).matches
    },
    handleTopBarClose () {
      this.topBarCollapsed = true
      EventBus.$emit('closeTopBar')
      this.$emit('closeTopBar')
    },
    handleTopBarOpen () {
      this.topBarCollapsed = false
      EventBus.$emit('openTopBar')
      this.$emit('openTopBar')
    },
    checkWidth () {
      setTimeout(() => {
        let inner = this.$el.querySelector('.ods-main-header__inner')
        let innerWidth = ((inner && inner.offsetWidth) - 48) || 0
        let right = this.$el.querySelector('.ods-main-header__inner--right')
        let rightWidth = (right && right.offsetWidth) || 0
        let logo = this.$el.querySelector('.ods-main-header__inner--left > .ods-main-header__wrapper')
        let logoWidth = (logo && logo.offsetWidth) || 0
        let breads = this.$el.querySelector('.ods-main-header__breadcrumbs')
        let breadsWidth = (breads && breads.offsetWidth) + 24 || 0
        let available = innerWidth - rightWidth - logoWidth
        if (this.handleBreadcrumbsWidth) {
          this.handleBreadcrumbsWidth = (available < this.breadcrumbsWidth)
        } else if (available < breadsWidth) {
          this.handleBreadcrumbsWidth = (available < breadsWidth)
          this.breadcrumbsWidth = breadsWidth
        }
      }, 0)
    }
  },
  data () {
    return {
      isMobile: false,
      isPhone: false,
      isTablet: false,
      topBarCollapsed: false,
      handleBreadcrumbsWidth: false,
      breadcrumbsWidth: 0,
      appHasNavigation: true
    }
  },
  mounted () {
    window.addEventListener('resize', () => this.checkOnResize())
    this.checkOnResize()
    EventBus.logoText = this.headerLogoText
    EventBus.logoUrl = this.logoUrl
    EventBus.showSuitesMenu = this.showSuitesMenu
    EventBus.hasTopBar = this.$slots.topbar
    this.checkIfPhone()
    this.appHasNavigation = this.$root.$children[0].$children.find(e => e.$options._componentTag === 'nav-content')
  }
}

</script>
