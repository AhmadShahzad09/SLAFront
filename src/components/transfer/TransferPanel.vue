<template>
  <div class="ods-transfer-panel">
    <p class="ods-transfer-panel__header">
      <ods-checkbox
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate">
        {{ title }}
        <span>{{ checkedSummary }}</span>
      </ods-checkbox>
    </p>

    <div :class="['ods-transfer-panel__body', hasFooter ? 'is-with-footer' : '']">
      <ods-input
        class="ods-transfer-panel__filter"
        v-model="query"
        size="small"
        :placeholder="placeholder"
        @mouseenter.native="inputHover = true"
        @mouseleave.native="inputHover = false"
        v-if="filterable">
        <i slot="prefix"
          :class="['ods-input__icon', 'ods-icon-' + inputIcon]"
          @click="clearQuery"
        ></i>
      </ods-input>
      <ods-checkbox-group
        v-model="checked"
        v-show="!tree && !hasNoMatch && data.length > 0"
        :class="{ 'is-filterable': filterable }"
        class="ods-transfer-panel__list">
        <ods-checkbox
          class="ods-transfer-panel__item"
          :label="item[keyProp]"
          :disabled="item[disabledProp]"
          :key="item[keyProp]"
          v-for="item in filteredData">
          <option-content :option="item"></option-content>
        </ods-checkbox>
      </ods-checkbox-group>
      <ods-tree
        ref="tree"
        v-show="tree && data.length > 0"
        :data="filteredData"
        :show-checkbox="true"
        :defaultExpandAll="true"
        :expandOnClickNode="true"
        :checkOnClickNode="true"
        :default-expanded-keys="defaultChecked"
        :default-checked-keys="defaultChecked"
        :filter-node-method="filterMethod"
        @check-change="handleTreeCheckedChange"
      ></ods-tree>
      <p
        class="ods-transfer-panel__empty"
        v-show="hasNoMatch">{{ t('el.transfer.noMatch') }}</p>
      <p
        class="ods-transfer-panel__empty"
        v-show="data.length === 0 && !hasNoMatch">{{ t('el.transfer.noData') }}</p>
    </div>
    <p class="ods-transfer-panel__footer" v-if="hasFooter">
      <slot></slot>
    </p>
  </div>
</template>

<script>
import OdsCheckboxGroup from '../checkbox-group/CheckboxGroup'
import OdsCheckbox from '../checkbox/Checkbox'
import OdsInput from '../input/Input'
import Locale from '@/addons/mixins/locale'

export default {
  mixins: [Locale],

  name: 'OdsTransferPanel',

  componentName: 'OdsTransferPanel',

  components: {
    OdsCheckboxGroup,
    OdsCheckbox,
    OdsInput,
    OptionContent: {
      props: {
        option: Object
      },
      render (h) {
        const getParent = vm => {
          if (vm.$options.componentName === 'OdsTransferPanel') {
            return vm
          } else if (vm.$parent) {
            return getParent(vm.$parent)
          } else {
            return vm
          }
        }
        const panel = getParent(this)
        const transfer = panel.$parent || panel
        return panel.renderContent
          ? panel.renderContent(h, this.option)
          : transfer.$scopedSlots.default
            ? transfer.$scopedSlots.default({ option: this.option })
            : <span>{ this.option[panel.labelProp] || this.option[panel.keyProp] }</span>
      }
    }
  },

  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    renderContent: Function,
    placeholder: String,
    title: String,
    filterable: Boolean,
    format: Object,
    filterMethod: Function,
    defaultChecked: Array,
    props: Object,
    tree: Boolean
  },

  data () {
    return {
      checked: [],
      allChecked: false,
      query: '',
      inputHover: false,
      checkChangeByUser: true
    }
  },

  watch: {
    checked (val, oldVal) {
      this.updateAllChecked()
      if (this.checkChangeByUser) {
        const movedKeys = val.concat(oldVal)
          .filter(v => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1)
        this.$emit('checked-change', val, movedKeys)
      } else {
        this.$emit('checked-change', val)
        this.checkChangeByUser = true
        this.checked = []
      }
    },

    data () {
      const checked = []
      const filteredDataKeys = this.mapItems(this.filteredData, [])
      this.checked.forEach(item => {
        if (filteredDataKeys.indexOf(item) > -1) {
          checked.push(item)
        }
      })
      this.checkChangeByUser = false
      this.checked = checked
    },

    checkableData () {
      this.updateAllChecked()
    },

    query (val) {
      this.checked = []
      if (this.$refs.tree && this.tree) {
        this.$refs.tree.filter(val)
      }
    },

    defaultChecked: {
      immediate: true,
      handler (val, oldVal) {
        if (oldVal && val.length === oldVal.length &&
            val.every(item => oldVal.indexOf(item) > -1)) return
        const checked = []
        // const checkableDataKeys = this.checkableData.map(item => item[this.keyProp])
        const checkableDataKeys = this.mapItems(this.checkableData, [])
        val.forEach(item => {
          if (checkableDataKeys.indexOf(item) > -1) {
            checked.push(item)
          }
        })
        this.checkChangeByUser = true
        this.checked = checked
      }
    }
  },

  computed: {
    filteredData () {
      return !this.tree ? this.getFilteredData(this.data) : this.data
    },

    checkableData () {
      return this.getCheckableData(this.filteredData)
    },

    dataLength () {
      let arr = this.mapItems(this.checkableData, [])
      return arr.length
    },

    checkedSummary () {
      const checkedLength = this.checked.length
      const { noChecked, hasChecked } = this.format
      if (noChecked && hasChecked) {
        return checkedLength > 0
          ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, this.dataLength)
          : noChecked.replace(/\${total}/g, this.dataLength)
      } else {
        return `${checkedLength}/${this.dataLength}`
      }
    },

    isIndeterminate () {
      const checkedLength = this.checked.length
      return checkedLength > 0 && checkedLength < this.checkableData.length
    },

    hasNoMatch () {
      return this.query.length > 0 && this.filteredData.length === 0
    },

    inputIcon () {
      return this.query.length > 0 && this.inputHover
        ? 'circle-close'
        : 'search'
    },

    labelProp () {
      return this.props.label || 'label'
    },

    keyProp () {
      return this.props.key || 'key'
    },

    disabledProp () {
      return this.props.disabled || 'disabled'
    },

    hasFooter () {
      return !!this.$slots.default
    }
  },

  methods: {
    updateAllChecked () {
      const checkableDataKeys = this.mapItems(this.checkableData, [])
      this.allChecked = checkableDataKeys.length > 0 &&
          checkableDataKeys.every(item => this.checked.indexOf(item) > -1)
      if (this.$refs.tree) this.updateTreeAllChecked(this.$refs.tree.root.childNodes)
    },

    handleAllCheckedChange (value) {
      this.checked = value
        ? this.mapItems(this.checkableData, [])
        : []
    },

    updateTreeAllChecked (arr) {
      arr.forEach((item) => {
        if (item.childNodes) this.updateTreeAllChecked(item.childNodes)
        item.checked = this.checked.indexOf(item.data[this.keyProp]) > -1 && !item[this.disabledProp]
      })
    },

    handleTreeCheckedChange (value) {
      this.checked = []
      this.checked = this.getCheckedData(this.$refs.tree.root.childNodes)
    },

    mapItems (arr, arrayKeys) {
      arr.map(item => {
        if (item.children) {
          this.mapItems(item.children, arrayKeys)
        }
        if (item[this.keyProp] && !item[this.disabledProp]) {
          arrayKeys.push(item[this.keyProp])
        }
      })
      return arrayKeys
    },

    getCheckedData (arr, value) {
      arr.map(item => {
        if (item.childNodes) {
          this.getCheckedData(item.childNodes, value)
        }
        if ((item.checked || item.indeterminate) && !item[this.disabledProp]) {
          this.checked.push(item.data[this.keyProp])
          this.checked.filter(c => c === item.parent.data[this.keyProp])
        }
      })
      return this.checked
    },

    getFilteredData (arr) {
      if (!this.query) return arr
      return arr.filter(item => {
        if (typeof this.filterMethod === 'function') {
          return this.filterMethod(this.query, item)
        } else {
          const label = item[this.labelProp] || item[this.keyProp].toString()
          if (label.toLowerCase().indexOf(this.query.toLowerCase()) > -1 && !item.children) {
            return item
          } else if (item.children && this.findDeep(item.children)) {
            this.getFilteredData(item.children)
            return item
          }
        }
      })
    },

    getCheckableData (arr) {
      return arr.filter(item => {
        if (item.children) {
          this.getCheckableData(item.children)
        }
        if (!item[this.disabledProp]) {
          return item
        }
      })
    },

    findDeep (data) {
      return data.some((e) => {
        const label = e[this.labelProp] || e[this.keyProp].toString()
        if (label.toLowerCase().indexOf(this.query.toLowerCase()) > -1) {
          return true
        } else if (e.children) return this.findDeep(e.children)
      })
    },

    clearQuery () {
      if (this.inputIcon === 'circle-close') {
        this.query = ''
      }
    }
  }
}
</script>
