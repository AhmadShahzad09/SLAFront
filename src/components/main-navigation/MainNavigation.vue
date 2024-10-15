<template>
  <nav
    class="ods-main-nav"
    :class="{
      'is-collapsed': collapsed,
      'ods-main-nav--is-mobile': isMobileMenu,
      'ods-main-nav--is-hidden': isHiddenMenu && isMobileMenu,
      'has-top-bar': hasTopBar
    }"
    role="navigation"
    ref="scrollableContent"
    v-clickoutside="hideSubMenus"
    @mouseleave="setTooltipDelay(750)">
    <div
      v-if="isMobileMenu"
      class="mobile-logo">
      <div class="mobile-logo__inner">
        <main-header-logo :hide="isHiddenMenu">
          <slot name="suites"/>
        </main-header-logo>
      </div>
    </div>
    <component
      :is="scrollTag()"
      v-bind="scrollTagProps">
        <ul
        class="ods-main-nav__ul"
        role="menu">
        <ods-navigation-item
          v-for="menuItem in navigation"
          :key="menuItem.name"
          :menuItem="menuItem"
          :collapsed="collapsed"
          :isMobile="isMobileMenu"
          :tooltipDelay="tooltipDelay"
          @checkScroll="checkIfScroll"
          @closeSubMenus="hideSubMenus"
          @setTooltipDelay="setTooltipDelay"
          ref="subMenuItem"/>
      </ul>
      <slot
        v-if="isPhone"
        name="isPhone-user-menu"/>
    </component>
    <ods-navigation-collapse-bar
      ref="collapseBar"
      :collapsed="collapsed"
      :hasScroll="hasScroll"
      :isMobile="isMobileMenu"
      @collapseClicked="toggleCollapse"/>
  </nav>
</template>

<script>
import OdsNavigationItem from './NavigationItem'
import OdsNavigationCollapseBar from './NavigationCollapseBar'
import MainHeaderLogo from '@/components/main-header/MainHeaderLogo'
import Clickoutside from '@/addons/utils/clickoutside'
import cssVars from '@/components/theme-onesait/common/var.scss'
import EventBus from '@/components/main-header/event-bus.js'
import { setTimeout } from 'timers'

export default {
  name: 'OdsMainNavigation',
  version: '2.0.0',
  category: 'navigation',
  lastDate: '13/04/2020',
  syncStatus: 'not-applicable',

  components: {
    OdsNavigationItem,
    OdsNavigationCollapseBar,
    MainHeaderLogo
  },

  directives: { Clickoutside },

  data () {
    return {
      hasScroll: false,
      isMobileMenu: false,
      isPhone: true,
      tooltipDelay: 750,
      collapsed: false,
      isHiddenMenu: true,
      hasTopBar: false
    }
  },

  props: {
    navigation: {
      type: Object,
      required: true
    }
  },

  methods: {
    toggleCollapse () {
      if (!this.isMobileMenu) {
        this.collapsed = !this.collapsed
        this.$emit('toggleCollapse', this.collapsed)
      }
    },

    scrollTag () {
      if (this.collapsed) {
        this.scrollTagProps = {
          class: 'no-scrolling-wrapper'
        }
        return 'div'
      } else {
        this.scrollTagProps = {
          wrapClass: 'scrollbar__wrap',
          viewClass: 'scrollbar__view'
        }
        return 'ods-scrollbar'
      }
    },

    checkIfScroll () {
      const nav = this.$refs.scrollableContent.querySelector('.scrollbar__view') || this.$refs.scrollableContent.querySelector('.no-scrolling-wrapper .ods-main-nav__ul')
      if (nav) {
        const pxToNumber = (value) => parseInt(value.split('px')[0])
        this.hasScroll = nav.offsetHeight > (document.documentElement.clientHeight - pxToNumber(cssVars.headerHeight) - pxToNumber(cssVars.collapseBar))
      }
    },

    hideSubMenus (childItem) {
      // resetNavigationItem for the next open (first level item)
      this.$refs.subMenuItem.forEach(c => {
        if (c.isOpen) setTimeout(() => c.resetNavigationItem(), 200)
      })

      const closeItemActions = c => {
        c.isOpen = false
        setTimeout(function () {
          c.reversedSubMenu = false
          c.reverseDiff = 0
        }, 200)
      }
      if (this.collapsed) {
        this.$refs.subMenuItem && this.$refs.subMenuItem.forEach(c => childItem ? childItem._uid !== c._uid && closeItemActions(c) : closeItemActions(c))
        this.setTooltipDelay(750)
      }
      if (this.isMobileMenu && !this.isHiddenMenu) {
        this.toggleMenu()
      }
    },

    toggleMenu () {
      this.isHiddenMenu = !this.isHiddenMenu
    },

    checkOnResize () {
      this.checkIfMobile()
      this.checkIfScroll()
      this.isPhone = EventBus.isPhone
    },

    setTooltipDelay (time) {
      this.tooltipDelay = time
      this.$children.forEach(c => c.showTooltip && (c.showTooltip = false))
    },

    checkIfMobile () {
      this.isMobileMenu = window.matchMedia(`(max-width: ${cssVars.menuBreakpoint})`).matches
      this.collapsed = this.isMobileMenu
    }
  },

  watch: {
    '$route' () {
      this.hideSubMenus()
    }
  },

  mounted () {
    window.addEventListener('resize', () => this.checkOnResize())
    this.checkIfScroll()
    this.checkIfMobile()
    this.isPhone = EventBus.isPhone
    this.hasTopBar = EventBus.hasTopBar
    EventBus.$on('toggleMenu', () => this.toggleMenu())
    EventBus.$on('closeTopBar', () => EventBus.hasTopBar = this.hasTopBar = false)
    EventBus.$on('openTopBar', () => EventBus.hasTopBar = this.hasTopBar = true)
  }
}
</script>
