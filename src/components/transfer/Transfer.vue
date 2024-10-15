<template>
  <div class="ods-transfer" data-name="OdsTransfer">
    <transfer-panel
      v-bind="$props"
      ref="leftPanel"
      :data="sourceData"
      :title="titles[0] || t('el.transfer.titles.0')"
      :default-checked="leftDefaultChecked"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      :tree="tree"
      @checked-change="onSourceCheckedChange">
      <slot name="left-footer"></slot>
    </transfer-panel>
    <div class="ods-transfer__buttons">
      <ods-button
        type="primary"
        :class="['ods-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        @click.native="addToLeft"
        :disabled="rightChecked.length === 0">
        <i class="ods-icon-arrow-left"></i>
        <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
      </ods-button>
      <ods-button
        type="primary"
        :class="['ods-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        @click.native="addToRight"
        :disabled="leftChecked.length === 0">
        <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
        <i class="ods-icon-arrow-right"></i>
      </ods-button>
    </div>
    <transfer-panel
      v-bind="$props"
      ref="rightPanel"
      :data="targetData"
      :title="titles[1] || t('el.transfer.titles.1')"
      :default-checked="rightDefaultChecked"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      :tree="tree"
      @checked-change="onTargetCheckedChange">
      <slot name="right-footer"></slot>
    </transfer-panel>
  </div>
</template>

<script>
import OdsButton from '@/components/button/Button'
import Emitter from '@/addons//mixins/emitter'
import Locale from '@/addons/mixins/locale'
import TransferPanel from './TransferPanel.vue'
import Migrating from '@/addons/mixins/migrating'

export default {
  name: 'OdsTransfer',
  version: '2.1.1',
  category: 'form',
  lastDate: '17/09/2020',
  syncStatus: 'aligned',
  mixins: [Emitter, Locale, Migrating],

  components: {
    TransferPanel,
    OdsButton
  },

  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    titles: {
      type: Array,
      default () {
        return []
      }
    },
    buttonTexts: {
      type: Array,
      default () {
        return []
      }
    },
    filterPlaceholder: {
      type: String,
      default: ''
    },
    filterMethod: Function,
    leftDefaultChecked: {
      type: Array,
      default () {
        return []
      }
    },
    rightDefaultChecked: {
      type: Array,
      default () {
        return []
      }
    },
    renderContent: Function,
    value: {
      type: Array,
      default () {
        return []
      }
    },
    format: {
      type: Object,
      default () {
        return {}
      }
    },
    filterable: Boolean,
    props: {
      type: Object,
      default () {
        return {
          label: 'label',
          key: 'key',
          disabled: 'disabled'
        }
      }
    },
    targetOrder: {
      type: String,
      default: 'original'
    },
    tree: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      leftChecked: [],
      rightChecked: [],
      itemsToBeMoved: [],
      itemsMoved: []
    }
  },

  computed: {
    dataObj () {
      return this.getDataObj(this.data, {})
    },

    sourceData () {
      const data = JSON.parse(JSON.stringify(this.data))
      let sourceData = this.value.length ? this.removeItems(data) : this.data
      return sourceData
    },

    targetData () {
      if (this.targetOrder === 'original') {
        this.getItemsMoved()
        return this.itemsMoved
      } else {
        return this.value.reduce((arr, cur) => {
          const val = this.dataObj[cur]
          if (val) {
            if (!val.children) arr.push(val)
          }
          return arr
        }, [])
      }
    },

    hasButtonTexts () {
      return this.buttonTexts.length === 2
    }
  },

  watch: {
    value (val) {
      this.dispatch('OdsFormItem', 'el.form.change', val)
    }
  },

  methods: {
    getMigratingConfig () {
      return {
        props: {
          'footer-format': 'footer-format is renamed to format.'
        }
      }
    },

    onSourceCheckedChange (val, movedKeys) {
      this.leftChecked = val
      if (movedKeys === undefined) return
      this.$emit('left-check-change', val, movedKeys)
    },

    onTargetCheckedChange (val, movedKeys) {
      this.rightChecked = val
      if (movedKeys === undefined) return
      this.$emit('right-check-change', val, movedKeys)
    },

    addToLeft () {
      let currentValue = this.value.slice()
      this.rightChecked.forEach(item => {
        const index = currentValue.indexOf(item)
        if (index > -1) {
          currentValue.splice(index, 1)
        }
      })
      this.$emit('input', currentValue)
      this.$emit('change', currentValue, 'left', this.rightChecked)
    },

    addToRight () {
      let currentValue = this.value.slice()
      let itemsToBeMoved = []
      const key = this.props.key
      this.getItemsToBeMoved(this.data, key)
      itemsToBeMoved = this.itemsToBeMoved

      currentValue = this.targetOrder === 'unshift'
        ? itemsToBeMoved.concat(currentValue)
        : currentValue.concat(itemsToBeMoved)

      this.$emit('input', currentValue)
      this.$emit('change', currentValue, 'right', this.leftChecked)
      this.itemsToBeMoved = []
      this.leftChecked = []
    },

    getItemsToBeMoved (arr, key) {
      arr.map(item => {
        const itemKey = item[key]
        if (
          this.leftChecked.indexOf(itemKey) > -1 &&
            this.value.indexOf(itemKey) === -1
        ) {
          this.itemsToBeMoved.push(itemKey)
        }
        if (item.children) this.getItemsToBeMoved(item.children, key)
      })
    },

    getItemsMoved () {
      this.itemsMoved = []
      this.addItems(JSON.parse(JSON.stringify(this.data)))
    },

    getDataObj (arr, obj) {
      return arr.reduce((o, cur) => {
        if (cur.children) {
          this.getDataObj(cur.children, obj)
        }
        if ((obj[cur[this.props.key]] = cur) && o) {
          return obj
        }
      }, {})
    },

    addItems (arr) {
      return arr.map((item, idx) => {
        if (this.value.indexOf(item[this.props.key]) > -1) {
          if (item.children) {
            item.children = item.children.filter(child => this.value.indexOf(child[this.props.key]) > -1)
            this.addItems(item.children)
          } else {
            this.itemsMoved.push(item)
          }
        }
      })
    },

    removeItems (arr) {
      return arr.filter((item) => {
        if (item.children) {
          this.removeItems(item.children)
        }
        if ((this.value.indexOf(item[this.props.key]) === -1) || (this.value.indexOf(item[this.props.key]) > -1 && item.children)) {
          return item
        } else {
          if (this.tree) {
            item.disabled = true
            return item
          }
        }
      })
    },

    clearQuery (which) {
      if (which === 'left') {
        this.$refs.leftPanel.query = ''
      } else if (which === 'right') {
        this.$refs.rightPanel.query = ''
      }
    }
  }
}
</script>
