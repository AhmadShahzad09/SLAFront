<template>
  <transition name="ods-zoom-in-top" @after-leave="doDestroy">
    <div
      v-show="showPopper"
      class="ods-autocomplete-suggestion ods-popper"
      :class="{ 'is-loading': !parent.hideLoading && parent.loading }"
      :style="{ width: dropdownWidth }"
      role="region">
      <ods-scrollbar
        tag="ul"
        wrap-class="ods-autocomplete-suggestion__wrap"
        view-class="ods-autocomplete-suggestion__list">
        <li v-if="!parent.hideLoading && parent.loading"><i class="ods-icon-loading"></i></li>
        <slot v-else>
        </slot>
      </ods-scrollbar>
    </div>
  </transition>
</template>
<script>
import Popper from '@/addons/utils/vue-popper'
import Emitter from '@/addons/mixins/emitter'
import OdsScrollbar from '@/components/scrollbar/Scrollbar'

export default {
  components: { OdsScrollbar },
  mixins: [Popper, Emitter],

  componentName: 'OdsAutocompleteSuggestions',

  data () {
    return {
      parent: this.$parent,
      dropdownWidth: ''
    }
  },

  props: {
    options: {
      default () {
        return {
          gpuAcceleration: false
        }
      }
    },
    id: String
  },

  methods: {
    select (item) {
      this.dispatch('OdsAutocomplete', 'item-click', item)
    }
  },

  updated () {
    this.$nextTick(_ => {
      this.popperJS && this.updatePopper()
    })
  },

  mounted () {
    this.$parent.popperElm = this.popperElm = this.$el
    this.referenceElm = this.$parent.$refs.input.$refs.input
    this.referenceList = this.$el.querySelector('.ods-autocomplete-suggestion__list')
    this.referenceList.setAttribute('role', 'listbox')
    this.referenceList.setAttribute('id', this.id)
  },

  created () {
    this.$on('visible', (val, inputWidth) => {
      this.dropdownWidth = inputWidth + 'px'
      this.showPopper = val
    })
  }
}
</script>
