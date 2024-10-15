<template>
  <li
    class="ods-main-nav__item"
    :class="[
      {
      'ods-main-nav__item--collapsed': collapsed,
      'active': activeItem
      },
      customClass
    ]">
    <div class="ods-main-nav__item-inner">
      <div
        @mouseenter="tooltipOn($event)"
        @mouseleave="tooltipOff()"
        class="ods-main-nav__item-link"
        :class="{
          'ods-main-nav__item-link--dropdown': hasChildren,
          'ods-main-nav__item-link--active': isOpen,
          'ods-main-nav__item-link--disabled': menuItem.disabled
          }">
          <ods-tooltip
            popper-class="ods-main-nav__tooltip"
            :content="menuItem.name"
            placement="right"
            :enterable="false"
            v-model="showTooltip"
            :manual="true">
            <component
              :is="linkTag()"
              v-bind="linkTagProps"
              @click="subMenuToggle">
              <ods-icon
                v-if="menuItem.icon"
                class="ods-main-nav__icon"
                :name="menuItem.icon"
                size="22"/>
              <span
                class="ods-main-nav__item-text">
                {{ menuItem.name }}</span>
              <ods-icon
                v-if="hasChildren && !collapsed"
                class="dropdown-icon"
                :name="isOpen ? 'arrow-down arrow-down--rotated' : 'arrow-down'"
                size="20" />
            </component>
          </ods-tooltip>
      </div>
      <ods-navigation-submenu
        ref="OdsNavigationSubmenu"
        v-if="hasChildren"
        :children="menuItem.children"
        :subMenuName="menuItem.name"
        :isOpen="isOpen"
        :collapsed="collapsed"
        :reversed="reversedSubMenu"
        :reverseDiff="reverseDiff"
        :isFirstLevelItem="isFirstLevelItem"
        :scrollHeight="scrollHeight ? scrollHeight : 'auto'"
        :submenuMaxHeight="submenuMaxHeight ? submenuMaxHeight : null"
        @checkScroll="checkScroll"
        @checkSubMenuDirection="checkSubMenuDirection"
        @checkTransitionEndClose="el => checkNeedScroll(el, false)"
        @checkTransitionEndOpen="el => checkNeedScroll(el, true)" />
    </div>
  </li>
</template>

<script>
import OdsNavigationSubmenu from './NavigationSubmenu'
import { setTimeout, clearTimeout } from 'timers'

const hasChildren = item => item.hasOwnProperty('children') && Object.keys(item.children).length

export default {
  name: 'OdsNavigationItem',

  components: {
    OdsNavigationSubmenu
  },

  props: {
    menuItem: {
      required: true,
      type: Object
    },
    collapsed: {
      type: Boolean,
      required: true
    },
    isMobile: {
      type: Boolean
    },
    tooltipDelay: {
      type: Number
    },
    activeChildPath: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      isOpen: false,
      showTooltip: false,
      reversedSubMenu: false,
      reverseDiff: 0,
      isFirstLevelItem: false,
      isMounted: false,
      scrollHeight: null,
      submenuMaxHeight: null
    }
  },

  computed: {
    hasChildren () {
      return hasChildren(this.menuItem)
    },

    isExternal () {
      return !(this.menuItem.to instanceof Object) && this.menuItem.to && this.menuItem.to.includes('http')
    },

    activeItem () {
      const getPath = (item, keyCompare) => typeof item.to === 'object' ? item.to[keyCompare] : item.to
      const findComparisonKey = item => {
        return typeof item === 'object' && item.hasOwnProperty('name') ? 'name' : 'path'
      }
      const findActiveItem = (item) => {
        let isActive = false
        const keyCompare = findComparisonKey(item.to)
        const itemCompare = getPath(item, keyCompare)
        if (this.$route.path === '/') {
          isActive = getPath(item, 'path') === '/'
        } else {
          if (keyCompare === 'path') {
            const path = this.$route.fullPath
            isActive = (path === itemCompare || path === itemCompare + '/') || this.activeChildPath
          } else {
            isActive = itemCompare !== '/' && (this.$route.matched.some(route => route[keyCompare] === itemCompare))
          }
          if (!isActive && this.$refs.OdsNavigationSubmenu) {
            return this.$refs.OdsNavigationSubmenu.activeItem
          }
        }
        return isActive
      }
      return this.isMounted && findActiveItem(this.menuItem)
    },

    customClass () {
      return this.menuItem.cssClass ? this.menuItem.cssClass : ''
    }

  },

  methods: {
    subMenuToggle (el) {
      if (this.collapsed) {
        this.$parent.hideSubMenus && this.$parent.hideSubMenus(this)
        if (this.hasChildren && this.isFirstLevelItem) {
          this.checkSubMenuDirection(el)
        }
      }
      this.isOpen = !this.isOpen
      this.tooltipOff()
      this.checkLevelItem(el)
    },

    checkSubMenuDirection (el) {
      const subMenu = el.currentTarget.closest('.ods-main-nav__item--collapsed').querySelector('.sub-menu__ul')

      subMenu.classList.add('get-item-info')
      const titleHeight = subMenu.querySelector('.sub-menu__title--first-level').offsetHeight
      const scrollContentHeight = subMenu.querySelector('.sub-menu__scroll-container').offsetHeight
      const bounding = subMenu.getBoundingClientRect()
      subMenu.classList.remove('get-item-info')

      if (window.innerHeight - bounding.height < bounding.top &&
          bounding.top > bounding.height) {
        this.reverseDiff = bounding.height
        this.reversedSubMenu = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight)
        this.scrollHeight = `${bounding.height - titleHeight}px`
      } else {
        if (this.reversedSubMenu) {
          this.scrollHeight = `${scrollContentHeight}px`
        } else {
          const remainingSpace = window.innerHeight - bounding.y
          this.submenuMaxHeight = `${remainingSpace - 20}px`

          remainingSpace < bounding.height && remainingSpace > 120 // '120px' prevents a too small scroll container;
            ? this.scrollHeight = `${remainingSpace - titleHeight - 20}px` // '20px' is security space above
            : this.resetNavigationItem()
        }
      }
    },

    /**
     * Reset scrollHeight prop and reset all not-collapsed submenus
     */
    resetNavigationItem () {
      this.scrollHeight = null
      setTimeout(() => this.$refs.OdsNavigationSubmenu ? this.$refs.OdsNavigationSubmenu.$refs.navigationItem.forEach(c => c.isOpen = false) : {}
        , 200)
    },
    checkScroll () {
      this.$emit('checkScroll')
    },

    tooltipOn (e) {
      this.checkLevelItem(e)
      if (this.collapsed && this.isFirstLevelItem && !this.isMobile) {
        this.showTooltip = true
        this.timeOut = setTimeout(() => { this.showTooltip = true }, this.tooltipDelay)
        this.$emit('setTooltipDelay', 0)
      }
    },

    tooltipOff () {
      this.showTooltip = false
      clearTimeout(this.timeOut)
    },

    checkLevelItem (e) {
      this.isFirstLevelItem = !e.target.closest('.sub-menu__ul')
    },

    closeSubMenu () {
      this.isOpen = false
    },

    linkTag () {
      if (this.isExternal) {
        this.linkTagProps = {
          href: this.menuItem.to,
          target: '_blank'
        }
        return 'a'
      } else if (this.hasChildren || this.menuItem.disabled) {
        this.linkTagProps = {}
        return 'span'
      } else {
        this.linkTagProps = {
          to: this.menuItem.to
        }
        return 'router-link'
      }
    },
    checkNeedScroll (el, isOpen) {
      if (!this.isFirstLevelItem && !el.closest('.sub-menu__ul--reversed')) {
        const subMenuScroll = el.closest('.sub-menu__scroll-container')
        if (subMenuScroll) {
          const bounding = subMenuScroll.getBoundingClientRect()
          const remainingSpace = window.innerHeight - bounding.y

          if (remainingSpace <= bounding.height && isOpen) {
            subMenuScroll.style.height = `${remainingSpace - 20}px` // 20px is the space left over
          }

          if (remainingSpace >= subMenuScroll.querySelector('.ods-scrollbar__view').offsetHeight && !isOpen) {
            subMenuScroll.style.height = 'auto'
          }
        }
      }
    }
  },
  mounted () {
    this.isMounted = true
    this.isOpen = this.activeItem
  }
}
</script>
