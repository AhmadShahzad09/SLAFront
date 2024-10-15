<template>
  <div
    data-name="OdsAutocomplete"
    class="ods-autocomplete"
    v-clickoutside="close"
    aria-haspopup="listbox"
    role="combobox"
    :aria-expanded="suggestionVisible"
    :aria-owns="id"
  >
    <ods-input
      ref="input"
      v-bind="[$props, $attrs]"
      @input="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @clear="handleClear"
      @keydown.up.native.prevent="highlight(highlightedIndex - 1)"
      @keydown.down.native.prevent="highlight(highlightedIndex + 1)"
      @keydown.enter.native="handleKeyEnter"
      @keydown.native.tab="close"
      :label="label"
    >
      <template slot="prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </template>
      <template slot="append" v-if="$slots.append">
        <slot name="append"></slot>
      </template>
      <template slot="prefix" v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <template slot="suffix" v-if="$slots.suffix">
        <slot name="suffix"></slot>
      </template>
    </ods-input>
    <ods-autocomplete-suggestions
      visible-arrow
      :class="[popperClass ? popperClass : '']"
      :popper-options="popperOptions"
      :append-to-body="popperAppendToBody"
      ref="suggestions"
      :placement="placement"
      :id="id">
      <li
        v-for="(item, index) in suggestions"
        :key="index"
        :class="{'highlighted': highlightedIndex === index}"
        @click="select(item)"
        :id="`${id}-item-${index}`"
        role="option"
        :aria-selected="highlightedIndex === index"
      >
        <slot :item="item">
          {{ item[valueKey] }}
        </slot>
      </li>
    </ods-autocomplete-suggestions>
  </div>
</template>
<script>
import debounce from 'throttle-debounce/debounce'
import OdsInput from '@/components/input/Input'
import Clickoutside from '@/addons/utils/clickoutside'
import OdsAutocompleteSuggestions from './AutocompleteSuggestions.vue'
import Emitter from '@/addons/mixins/emitter'
import Migrating from '@/addons/mixins/migrating'
import { generateId } from '@/addons/utils/util'
import Focus from '@/addons/mixins/focus'

export default {
  name: 'OdsAutocomplete',
  version: '2.0.0',
  lastDate: '13/04/2020',

  mixins: [Emitter, Focus('input'), Migrating],

  inheritAttrs: false,

  componentName: 'OdsAutocomplete',

  components: {
    OdsInput,
    OdsAutocompleteSuggestions
  },

  directives: { Clickoutside },

  props: {
    valueKey: {
      type: String,
      default: 'value'
    },
    popperClass: String,
    popperOptions: Object,
    placeholder: String,
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
    name: String,
    size: String,
    value: String,
    maxlength: Number,
    minlength: Number,
    autofocus: Boolean,
    fetchSuggestions: Function,
    triggerOnFocus: {
      type: Boolean,
      default: true
    },
    customItem: String,
    selectWhenUnmatched: {
      type: Boolean,
      default: false
    },
    prefixIcon: String,
    suffixIcon: String,
    label: String,
    debounce: {
      type: Number,
      default: 300
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    hideLoading: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    },
    highlightFirstItem: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activated: false,
      suggestions: [],
      loading: false,
      highlightedIndex: -1,
      suggestionDisabled: false
    }
  },
  computed: {
    suggestionVisible () {
      const suggestions = this.suggestions
      let isValidData = Array.isArray(suggestions) && suggestions.length > 0
      return (isValidData || this.loading) && this.activated
    },
    id () {
      return `ods-autocomplete-${generateId()}`
    }
  },
  watch: {
    suggestionVisible (val) {
      let $input = this.getInput()
      if ($input) {
        this.broadcast('OdsAutocompleteSuggestions', 'visible', [val, $input.offsetWidth])
      }
    }
  },
  methods: {
    getMigratingConfig () {
      return {
        props: {
          'custom-item': 'custom-item is removed, use scoped slot instead.',
          'props': 'props is removed, use value-key instead.'
        }
      }
    },
    getData (queryString) {
      if (this.suggestionDisabled) {
        return
      }
      this.loading = true
      this.fetchSuggestions(queryString, (suggestions) => {
        this.loading = false
        if (this.suggestionDisabled) {
          return
        }
        if (Array.isArray(suggestions)) {
          this.suggestions = suggestions
          this.highlightedIndex = this.highlightFirstItem ? 0 : -1
        } else {
          console.error('[ODS Error][Autocomplete]autocomplete suggestions must be an array')
        }
      })
    },
    handleChange (value) {
      this.$emit('input', value)
      this.suggestionDisabled = false
      if (!this.triggerOnFocus && !value) {
        this.suggestionDisabled = true
        this.suggestions = []
        return
      }
      this.debouncedGetData(value)
    },
    handleFocus (event) {
      this.activated = true
      this.$emit('focus', event)
      if (this.triggerOnFocus) {
        this.debouncedGetData(this.value)
      }
    },
    handleBlur (event) {
      this.$emit('blur', event)
    },
    handleClear () {
      this.activated = false
      this.$emit('clear')
    },
    close (e) {
      this.activated = false
    },
    handleKeyEnter (e) {
      if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
        e.preventDefault()
        this.select(this.suggestions[this.highlightedIndex])
      } else if (this.selectWhenUnmatched) {
        this.$emit('select', { value: this.value })
        this.$nextTick(_ => {
          this.suggestions = []
          this.highlightedIndex = -1
        })
      }
    },
    select (item) {
      this.$emit('input', item[this.valueKey])
      this.$emit('select', item)
      this.$nextTick(_ => {
        this.suggestions = []
        this.highlightedIndex = -1
      })
    },
    highlight (index) {
      if (!this.suggestionVisible || this.loading) { return }
      if (index < 0) {
        this.highlightedIndex = -1
        return
      }
      if (index >= this.suggestions.length) {
        index = this.suggestions.length - 1
      }
      const suggestion = this.$refs.suggestions.$el.querySelector('.ods-autocomplete-suggestion__wrap')
      const suggestionList = suggestion.querySelectorAll('.ods-autocomplete-suggestion__list li')

      let highlightItem = suggestionList[index]
      let scrollTop = suggestion.scrollTop
      let offsetTop = highlightItem.offsetTop

      if (offsetTop + highlightItem.scrollHeight > (scrollTop + suggestion.clientHeight)) {
        suggestion.scrollTop += highlightItem.scrollHeight
      }
      if (offsetTop < scrollTop) {
        suggestion.scrollTop -= highlightItem.scrollHeight
      }
      this.highlightedIndex = index
      let $input = this.getInput()
      $input.setAttribute('aria-activedescendant', `${this.id}-item-${this.highlightedIndex}`)
    },
    getInput () {
      return this.$refs.input.getInput()
    }
  },
  mounted () {
    this.debouncedGetData = debounce(this.debounce, this.getData)
    this.$on('item-click', item => {
      this.select(item)
    })
    let $input = this.getInput()
    $input.setAttribute('role', 'textbox')
    $input.setAttribute('aria-autocomplete', 'list')
    $input.setAttribute('aria-controls', 'id')
    $input.setAttribute('aria-activedescendant', `${this.id}-item-${this.highlightedIndex}`)
  },
  beforeDestroy () {
    this.$refs.suggestions.$destroy()
  }
}
</script>
