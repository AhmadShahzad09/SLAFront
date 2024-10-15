<script type="text/jsx">
import emitter from '@/addons/mixins/emitter'
import Migrating from '@/addons/mixins/migrating'
import Menubar from '@/addons/utils/menu/aria-menubar'
import { addClass, removeClass, hasClass } from '@/addons/utils/dom'

export default {
  name: 'OdsMenu',
  menuversion: '2.0.0',
  category: 'navigation',
  lastDate: '13/04/2020',
  syncStatus: 'discarded',

  render (h) {
    const component = (
      <ul
        role="menubar"
        data-name="OdsMenu"
        key={ +this.collapse }
        style={{ backgroundColor: this.backgroundColor || '' }}
        class={{
          'ods-menu--horizontal': this.mode === 'horizontal',
          'ods-menu--collapse': this.collapse,
          'ods-menu': true,
          'ods-menu--fixed': this.position === 'fixed',
          'ods-menu--firstlevel': this.isFirstLevel
        }}
      >
        { this.$slots.default }
      </ul>
    )

    if (this.collapseTransition) {
      return (
        <ods-menu-collapse-transition>
          { component }
        </ods-menu-collapse-transition>
      )
    } else {
      return component
    }
  },

  componentName: 'OdsMenu',

  mixins: [emitter, Migrating],

  provide () {
    return {
      rootMenu: this
    }
  },

  components: {
    'ods-menu-collapse-transition': {
      functional: true,
      render (createElement, context) {
        const data = {
          props: {
            mode: 'out-in'
          },
          on: {
            beforeEnter (el) {
              el.style.opacity = 0.2
            },

            enter (el) {
              addClass(el, 'ods-opacity-transition')
              el.style.opacity = 1
            },

            afterEnter (el) {
              removeClass(el, 'ods-opacity-transition')
              el.style.opacity = ''
            },

            beforeLeave (el) {
              if (!el.dataset) el.dataset = {}

              if (hasClass(el, 'ods-menu--collapse')) {
                removeClass(el, 'ods-menu--collapse')
                el.dataset.oldOverflow = el.style.overflow
                el.dataset.scrollWidth = el.clientWidth
                addClass(el, 'ods-menu--collapse')
              } else {
                addClass(el, 'ods-menu--collapse')
                el.dataset.oldOverflow = el.style.overflow
                el.dataset.scrollWidth = el.clientWidth
                removeClass(el, 'ods-menu--collapse')
              }

              el.style.width = el.scrollWidth + 'px'
              el.style.overflow = 'hidden'
            },

            leave (el) {
              addClass(el, 'horizontal-collapse-transition')
              el.style.width = el.dataset.scrollWidth + 'px'
            }
          }
        }
        return createElement('transition', data, context.children)
      }
    }
  },

  props: {
    mode: {
      type: String,
      default: 'vertical'
    },
    position: {
      type: String,
      default: ''
    },
    isFirstLevel: {
      type: Boolean,
      default: false
    },
    defaultActive: {
      type: String,
      default: ''
    },
    defaultOpeneds: Array,
    uniqueOpened: Boolean,
    router: Boolean,
    menuTrigger: {
      type: String,
      default: 'hover'
    },
    collapse: Boolean,
    backgroundColor: String,
    textColor: String,
    activeTextColor: String,
    collapseTransition: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      activeIndex: this.defaultActive,
      openedMenus: (this.defaultOpeneds && !this.collapse) ? this.defaultOpeneds.slice(0) : [],
      items: {},
      submenus: {}
    }
  },
  computed: {
    hoverBackground () {
      return this.backgroundColor ? this.mixColor(this.backgroundColor, 0.2) : ''
    },
    isMenuPopup () {
      return this.mode === 'horizontal' || (this.mode === 'vertical' && this.collapse)
    }
  },
  watch: {
    defaultActive: 'updateActiveIndex',

    defaultOpeneds (value) {
      if (!this.collapse) {
        this.openedMenus = value
      }
    },

    collapse (value) {
      if (value) this.openedMenus = []
      this.broadcast('OdsSubmenu', 'toggle-collapse', value)
    }
  },
  methods: {
    updateActiveIndex () {
      const item = this.items[this.defaultActive]
      if (item) {
        this.activeIndex = item.index
        this.initOpenedMenu()
      } else {
        this.activeIndex = null
      }
    },

    getMigratingConfig () {
      return {
        props: {
          'theme': 'theme is removed.'
        }
      }
    },
    getColorChannels (color) {
      color = color.replace('#', '')
      if (/^[0-9a-fA-F]{3}$/.test(color)) {
        color = color.split('')
        for (let i = 2; i >= 0; i--) {
          color.splice(i, 0, color[i])
        }
        color = color.join('')
      }
      if (/^[0-9a-fA-F]{6}$/.test(color)) {
        return {
          red: parseInt(color.slice(0, 2), 16),
          green: parseInt(color.slice(2, 4), 16),
          blue: parseInt(color.slice(4, 6), 16)
        }
      } else {
        return {
          red: 255,
          green: 255,
          blue: 255
        }
      }
    },
    mixColor (color, percent) {
      let { red, green, blue } = this.getColorChannels(color)
      if (percent > 0) { // shade given color
        red *= 1 - percent
        green *= 1 - percent
        blue *= 1 - percent
      } else { // tint given color
        red += (255 - red) * percent
        green += (255 - green) * percent
        blue += (255 - blue) * percent
      }
      return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`
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
    openMenu (index, indexPath) {
      let openedMenus = this.openedMenus
      if (openedMenus.indexOf(index) !== -1) return

      // collapse all menu that are not under current menu item
      if (this.uniqueOpened) {
        this.openedMenus = openedMenus.filter(index => {
          return indexPath.indexOf(index) !== -1
        })
      }
      this.openedMenus.push(index)
    },
    closeMenu (index) {
      const i = this.openedMenus.indexOf(index)
      if (i !== -1) {
        this.openedMenus.splice(i, 1)
      }
    },
    handleSubmenuClick (submenu) {
      const { index, indexPath } = submenu
      let isOpened = this.openedMenus.indexOf(index) !== -1

      const oldActiveIndex = this.activeIndex

      this.activeIndex = submenu.index
      this.$emit('select', index, indexPath, submenu)

      if (submenu.isFirstLevel) {
        this.openedMenus = []
      }

      if (isOpened) {
        this.closeMenu(index)
        this.$emit('close', index, indexPath)
      } else {
        this.openMenu(index, indexPath)
        this.$emit('open', index, indexPath)
      }
    },
    handleItemClick (item) {
      const { index, indexPath } = item
      const oldActiveIndex = this.activeIndex

      this.activeIndex = item.index
      this.$emit('select', index, indexPath, item)

      if (this.mode === 'horizontal' || this.collapse) {
        this.openedMenus = []
      }

      if (this.router) {
        this.routeToItem(item, (error) => {
          this.activeIndex = oldActiveIndex
          if (error) console.error(error)
        })
      }
    },

    // initialize opened menu
    initOpenedMenu () {
      const index = this.activeIndex
      const activeItem = this.items[index]
      if (!activeItem || this.mode === 'horizontal' || this.collapse) return

      let indexPath = activeItem.indexPath

      // expand all submenus of the menu item
      indexPath.forEach(index => {
        let submenu = this.submenus[index]
        submenu && this.openMenu(index, submenu.indexPath)
      })
    },
    routeToItem (item, onError) {
      let route = item.route || item.index
      try {
        this.$router.push(route, () => {}, onError)
      } catch (e) {
        console.error(e)
      }
    },
    open (index) {
      const { indexPath } = this.submenus[index.toString()]
      indexPath.forEach(i => this.openMenu(i, indexPath))
    },
    close (index) {
      this.closeMenu(index)
    },
    handleClose (submenu) {
      if (this.openedMenus.length === 1) {
        this.openedMenus = []
      }
      if (this.openedMenus.length !== 1) {
        this.openedMenus.splice(-1, 1)
      }
    }
  },
  mounted () {
    this.initOpenedMenu()
    this.$on('item-click', this.handleItemClick)
    this.$on('submenu-click', this.handleSubmenuClick)
    this.$on('click-outside', this.handleClose)
    if (this.mode === 'horizontal') {
        new Menubar(this.$el); // eslint-disable-line
    }
    this.$watch('items', this.updateActiveIndex)
  }
}
</script>
