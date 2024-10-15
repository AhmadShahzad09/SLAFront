<template>
  <transition
    :name="collapsed && isFirstLevelItem ? 'menu-item-fade' : 'menu-item-expand'"
    @after-enter="transitionEndOpen"
    @after-leave="transitionEndClose"
    mode="out-in">

    <ul
      class="sub-menu__ul"
      :style="{
        'margin-top': reversed && isFirstLevelItem ? -reverseDiff+'px' : null,
        'max-height': !reversed ? submenuMaxHeight : null,
        'overflow': submenuMaxHeight && !reversed ? 'hidden' : null
      }"
      :class="{'sub-menu__ul--reversed': reversed}"
      v-show="isOpen">

      <li v-show="collapsed"
        class="sub-menu__title"
        :class="{'sub-menu__title--first-level': isFirstLevelItem}">{{ subMenuName }}</li>

      <template v-if="isFirstLevelItem">
        <li>
          <ods-scrollbar tag="ul" :style="{'height': scrollHeight }" class="sub-menu__scroll-container">
            <ods-navigation-item
              ref="navigationItem"
              class="sub-menu__li"
              :activeChildPath="index === activeItemIndex"
              v-for="(child, name, index) in children"
              :key="name"
              :menuItem="child"
              :collapsed="collapsed"
              @checkScroll="emitEvents"/>
          </ods-scrollbar >
        </li>
      </template>

      <template v-else>
        <ods-navigation-item
          ref="navigationItem"
          class="sub-menu__li"
          :activeChildPath="index === activeItemIndex"
          v-for="(child, name, index) in children"
          :key="name"
          :menuItem="child"
          :collapsed="collapsed"
          @checkScroll="emitEvents"/>
      </template>
    </ul>
  </transition>
</template>

<script>
const hasChildren = item => item && item.hasOwnProperty('children') && Object.keys(item.children).length

export default {
  name: 'OdsNavigationSubmenu',

  beforeCreate () {
    this.$options.components.OdsNavigationItem = require('./NavigationItem.vue').default
  },

  props: {
    children: {
      type: Object,
      required: true
    },
    subMenuName: {
      type: String,
      required: false
    },
    isOpen: {
      type: Boolean,
      required: true
    },
    collapsed: {
      type: Boolean,
      required: true
    },
    reversed: {
      type: Boolean,
      required: false
    },
    reverseDiff: {
      type: Number
    },
    isFirstLevelItem: {
      type: Boolean
    },
    scrollHeight: {
      type: String
    },
    submenuMaxHeight: {
      type: String
    }
  },
  computed: {
    activeItems () {
      const getPath = (item, keyCompare) => typeof item.to === 'object' ? item.to[keyCompare] : item.to
      const findComparisonKey = item => {
        return typeof item === 'object' && item.hasOwnProperty('name') ? 'name' : 'path'
      }
      const findActiveItem = (item) => {
        let isActive = false
        const keyCompare = item && item.to ? findComparisonKey(item.to) : null
        const itemCompare = item ? getPath(item, keyCompare) : null
        if (this.$route.path === '/') {
          isActive = getPath(item, 'path') === '/'
        } else {
          if (keyCompare === 'path') {
            isActive = this.$route.fullPath.includes(itemCompare)
          } else {
            isActive = itemCompare && (this.$route.matched.some(route => route[keyCompare] === itemCompare))
          }
          if (!isActive && hasChildren(item)) {
            let searchParent = item
            let ChildActive = {}
            while (hasChildren(searchParent)) {
              ChildActive = Object.values(searchParent.children).find(el => findActiveItem(el).isActive)
              searchParent = ChildActive
            }
            return findActiveItem(ChildActive)
          }
        }
        return { isActive, keyCompare, itemCompare }
      }
      const controlActive = []
      for (const child in this.children) {
        controlActive.push(findActiveItem(this.children[child]))
      }
      return controlActive
    },
    activeItemIndex () {
      let path = ''
      let index = -1
      this.activeItems.forEach((element, elIndex) => {
        if (element.isActive && element.itemCompare && element.itemCompare.length > path.length) {
          path = element.itemCompare
          index = elIndex
        }
      })
      return index
    },
    activeItem () {
      return this.activeItemIndex >= 0
    }
  },
  methods: {
    emitEvents () {
      this.$emit('checkScroll')
    },
    transitionEndClose (el) {
      this.$emit('checkTransitionEndClose', el)
      this.emitEvents()
    },
    transitionEndOpen (el) {
      this.$emit('checkTransitionEndOpen', el)
      this.emitEvents()
    }
  }
}
</script>
