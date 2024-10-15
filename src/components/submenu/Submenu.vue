<script>
import OdsCollapseTransition from '@/addons/transitions/collapse-transition'
import menuMixin from '@/components/menu/menu-mixin'
import Emitter from '@/addons/mixins/emitter'
import Popper from '@/addons/utils/vue-popper'
import Clickoutside from '@/addons/utils/clickoutside'
import OdsTooltip from '@/components/tooltip/Tooltip'

const poperMixins = {
  props: {
    transformOrigin: {
      type: [Boolean, String],
      default: false
    },
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions
  },
  data: Popper.data,
  methods: Popper.methods,
  beforeDestroy: Popper.beforeDestroy,
  deactivated: Popper.deactivated
}

export default {
  name: 'OdsSubmenu',

  componentName: 'OdsSubmenu',

  mixins: [menuMixin, Emitter, poperMixins],

  components: { OdsCollapseTransition, OdsTooltip },

  props: {
    index: {
      type: String,
      required: true
    },
    showTimeout: {
      type: Number,
      default: 300
    },
    hideTimeout: {
      type: Number,
      default: 300
    },
    popperClass: String,
    disabled: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: undefined
    },
    menuTrigger: {
      type: String,
      default: 'hover'
    }
  },
  directives: { Clickoutside },
  data () {
    return {
      popperJS: null,
      timeout: null,
      items: {},
      submenus: {},
      mouseInChild: false
    }
  },
  watch: {
    opened (val) {
      if (this.isMenuPopup) {
        this.$nextTick(_ => {
          this.updatePopper()
        })
      }
    }
  },
  computed: {
    // popper option
    appendToBody () {
      return this.popperAppendToBody === undefined
        ? this.isFirstLevel
        : this.popperAppendToBody
    },
    menuTransitionName () {
      return this.rootMenu.collapse && this.isFirstLevel ? 'ods-slide-in-left' : 'ods-zoom-in-top'
    },
    opened () {
      return this.rootMenu.openedMenus.indexOf(this.index) > -1
    },
    active () {
      return this.index === this.rootMenu.activeIndex
    },
    hoverBackground () {
      return this.rootMenu.hoverBackground
    },
    backgroundColor () {
      return this.rootMenu.backgroundColor || ''
    },
    activeTextColor () {
      return this.rootMenu.activeTextColor || ''
    },
    textColor () {
      return this.rootMenu.textColor || ''
    },
    mode () {
      return this.rootMenu.mode
    },
    isMenuPopup () {
      return this.rootMenu.isMenuPopup
    },
    titleStyle () {
      if (this.mode !== 'horizontal') {
        return {
          color: this.textColor
        }
      }
      return {
        borderBottomColor: this.active
          ? (this.rootMenu.activeTextColor ? this.activeTextColor : '')
          : 'transparent',
        color: this.active
          ? this.activeTextColor
          : this.textColor
      }
    },
    isFirstLevel () {
      let isFirstLevel = true
      let parent = this.$parent
      while (parent && parent !== this.rootMenu) {
        if (['OdsSubmenu', 'OdsMenuItemGroup'].indexOf(parent.$options.componentName) > -1) {
          isFirstLevel = false
          break
        } else {
          parent = parent.$parent
        }
      }
      return isFirstLevel
    },
    position () {
      return this.rootMenu.position ? this.rootMenu.position : 'absolute'
    },
    collapse () {
      return this.rootMenu.collapse ? 'collapsed' : 'expanded'
    }
  },
  methods: {
    handleCollapseToggle (value) {
      if (value) {
        this.initPopper()
      } else {
        this.doDestroy()
      }
    },
    addItem (item) {
      this.$set(this.items, item.index, item)
    },
    removeItem (item) {
      delete this.items[item.index]
    },
    addSubmenu (item) {
      this.$set(this.submenus, item.index, item)
    },
    removeSubmenu (item) {
      delete this.submenus[item.index]
    },
    handleClick () {
      const { rootMenu, disabled } = this
      if (
        (rootMenu.menuTrigger === 'hover' && rootMenu.mode === 'horizontal') ||
          disabled
      ) {
        return
      }
      this.dispatch('OdsMenu', 'submenu-click', this)
    },
    handleClickOutside () {
      if (this.isFirstLevel && this.opened) {
        this.dispatch('OdsMenu', 'click-outside', this)
      }
    },
    handleMouseenter () {
      const { rootMenu, disabled } = this
      if (
        (rootMenu.menuTrigger === 'click' && rootMenu.mode === 'horizontal') ||
          (!rootMenu.collapse && rootMenu.mode === 'vertical') ||
          (this.menuTrigger === 'click') ||
          disabled
      ) {
        return
      }
      this.dispatch('OdsSubmenu', 'mouse-enter-child')
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.rootMenu.openMenu(this.index, this.indexPath)
      }, this.showTimeout)
    },
    handleMouseleave () {
      const { rootMenu } = this
      if (
        (rootMenu.menuTrigger === 'click' && rootMenu.mode === 'horizontal') ||
          (this.menuTrigger === 'click')
      ) {
        return
      }
      this.dispatch('OdsSubmenu', 'mouse-leave-child')
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        !this.mouseInChild && this.rootMenu.closeMenu(this.index)
      }, this.hideTimeout)
    },
    handleTitleMouseenter () {
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return
      const title = this.$refs['submenu-title']
      title && (title.style.backgroundColor = this.rootMenu.hoverBackground)
    },
    handleTitleMouseleave () {
      if (this.mode === 'horizontal' && !this.rootMenu.backgroundColor) return
      const title = this.$refs['submenu-title']
      title && (title.style.backgroundColor = this.rootMenu.backgroundColor || '')
    },
    updatePlacement () {
      this.currentPlacement = this.mode === 'horizontal' && this.isFirstLevel
        ? 'bottom-start'
        : 'right-start'
    },
    initPopper () {
      this.referenceElm = this.$el
      this.popperElm = this.$refs.menu
      this.updatePlacement()
    }
  },
  created () {
    this.parentMenu.addSubmenu(this)
    this.rootMenu.addSubmenu(this)
    this.$on('toggle-collapse', this.handleCollapseToggle)
    this.$on('mouse-enter-child', () => {
      this.mouseInChild = true
      clearTimeout(this.timeout)
    })
    this.$on('mouse-leave-child', () => {
      this.mouseInChild = false
      clearTimeout(this.timeout)
    })
  },
  mounted () {
    this.initPopper()
  },
  beforeDestroy () {
    this.parentMenu.removeSubmenu(this)
    this.rootMenu.removeSubmenu(this)
  },
  render (h) {
    const {
      active,
      opened,
      paddingStyle,
      titleStyle,
      backgroundColor,
      rootMenu,
      currentPlacement,
      menuTransitionName,
      mode,
      position,
      collapse,
      disabled,
      popperClass,
      $slots
    } = this

    const popupMenu = (
      <transition name={menuTransitionName}>
        <div
          ref="menu"
          v-show={opened}
          class={[`ods-menu--${mode}`, `ods-menu--${position}`, `ods-menu--${collapse}`, `ods-menu--${this.isFirstLevel}`, 'ods-menu--submenu', popperClass]}
          v-clickoutside={ this.handleClickOutside }
          on-focus={this.handleMouseenter}>
          <ul
            role="menu"
            class={['ods-menu ods-menu--popup', `ods-menu--popup-${currentPlacement}`]}
            style={{ backgroundColor: rootMenu.backgroundColor || '' }}>
            {$slots.default}
          </ul>
        </div>
      </transition>
    )

    const popupMenu2 = (
      <ods-collapse-transition>
        <div
          ref="menu"
          v-show={opened}
          class={[`ods-menu--${mode}`, `ods-menu--${position}`, `ods-menu--${collapse}`, `ods-menu--${this.isFirstLevel}`, 'ods-menu--submenu', popperClass]}
          v-clickoutside={ this.handleClickOutside }
          on-focus={this.handleMouseenter}>
          <ul
            role="menu"
            class={['ods-menu ods-menu--popup', `ods-menu--popup-${currentPlacement}`]}
            style={{ backgroundColor: rootMenu.backgroundColor || '' }}>
            {$slots.default}
          </ul>
        </div>
      </ods-collapse-transition>
    )

    const inlineMenu = (
      <ods-collapse-transition>
        <ul
          role="menu"
          class="ods-menu ods-menu--inline"
          v-show={opened}
          style={{ backgroundColor: rootMenu.backgroundColor || '' }}>
          {$slots.default}
        </ul>
      </ods-collapse-transition>
    )

    const submenuTitleIcon = (
      rootMenu.mode === 'horizontal' ||
        rootMenu.mode === 'vertical' && rootMenu.collapse
    ) ? 'ods-icon-chevron-down' : 'ods-icon-chevron-right'

    let transitionMenu

    if (this.isFirstLevel) {
      transitionMenu = popupMenu
    } else {
      transitionMenu = popupMenu2
    }

    return (
      <li
        class={{
          'ods-submenu': true,
          'is-active': active,
          'is-opened': opened,
          'is-disabled': disabled
        }}
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={opened}
        // on-mouseenter={this.handleMouseenter}
        // on-mouseleave={this.handleMouseleave}
        on-focus={this.handleMouseenter}
      >
        <div
          class="ods-submenu__title"
          ref="submenu-title"
          on-click={this.handleClick}
          // on-mouseenter={this.handleTitleMouseenter}
          // on-mouseleave={this.handleTitleMouseleave}
          style={[paddingStyle, titleStyle, { backgroundColor }]}
        >
          {$slots.title}
          <p>title</p>
          <i class={[ 'ods-submenu__icon-arrow', submenuTitleIcon ]}></i>
          <ods-tooltip
            // v-show={this.parentMenu.$options.componentName === 'OdsMenu' && rootMenu.collapse && $slots.title && !active}
            effect="menu"
            placement="right"
            open-delay={800}>
            <div slot="content"><slot name="title">{$slots.title[2]}</slot></div>
            <div style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;display: inline-block;box-sizing: border-box;padding: 0 20px;">
              <slot></slot>
            </div>
          </ods-tooltip>
        </div>
        {this.isMenuPopup ? transitionMenu : inlineMenu}

      </li>
    )
  }
}
</script>
