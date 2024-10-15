<template>
  <div :class="[
    'ods-input-search',
    {
      [`ods-input-search--${size}`]: !!size,
      'ods-input-search--expandable': expandableSearch,
      'ods-input-search--is-expanded': isExpanded,
      'ods-input-search--is-clearable': clearable,
      'ods-input-search--is-line': outlined,
      'ods-input-search--is-disabled': disabled
    }
    ]"
    ref="main"
    v-clickoutside="handleExpand">
    <ods-input
      :placeholder="placeholder"
      searchInput
      v-model="inputValue"
      v-on="listeners"
      @keyEnter="handleSearch"
      :clearable="clearable"
      :disabled="disabled"
      ref="input">
      <span
        v-if="outlined"
        slot="prefix"
        class="ods-input__icon ods-icon-search"/>
      <ods-button
        v-if="!outlined"
        slot="append"
        :icon="buttonIcon"
        @click="handleSearch"
        :disabled="disabled"/>
    </ods-input>
  </div>
</template>

<script>
import Clickoutside from '@/addons/utils/clickoutside.js'
import OdsInput from '@/components/input/Input'
import OdsButton from '@/components/button/Button'

export default {
  name: 'OdsInputSearch',
  version: '2.0.2',
  category: 'form',
  lastDate: '29/04/2020',
  syncStatus: 'not-applicable',
  components: {
    OdsInput,
    OdsButton
  },
  directives: {
    Clickoutside
  },
  data () {
    return {
      isExpanded: false,
      inputValue: null
    }
  },
  mounted () {
    this.inputValue = this.$attrs.value
  },
  watch: {
    '$attrs.value' () {
      this.inputValue = this.$attrs.value
    }
  },
  computed: {
    buttonIcon () {
      return `ods-icon-${this.icon}`
    },
    listeners () {
      const { search, close, keyEnter, ...listeners } = this.$listeners
      return listeners
    }
  },
  props: {
    size: {
      type: String,
      default: 'deci',
      validator: size => ['full', 'micro', 'deci', 'hecto', 'mega', 'hexa'].includes(size)
    },
    expandableSearch: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Search'
    },
    icon: {
      type: String,
      default: 'search'
    },
    clearOnClose: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: String
    },
    disabled: {
      type: Boolean
    }
  },
  methods: {
    handleSearch () {
      if (!this.expandableSearch || (this.expandableSearch && this.isExpanded)) {
        this.$emit('search', this.inputValue)
      } else {
        this.isExpanded = true
        this.$refs.input.$el.querySelector('.ods-input__inner').focus()
      }
    },
    handleExpand () {
      if (!this.expandableSearch || !this.isExpanded) return
      this.isExpanded = false
      this.$emit('close')
      if (this.clearOnClose) this.inputValue = ''
    }
  }
}
</script>
