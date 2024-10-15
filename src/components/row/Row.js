export default {
  name: 'OdsRow',
  version: '2.0.0',
  category: 'other',
  lastDate: '13/04/2020',
  syncStatus: 'aligned',

  componentName: 'OdsRow',

  props: {
    tag: {
      type: String,
      default: 'div'
    },
    gutter: Number,
    type: String,
    justify: {
      type: String,
      default: 'start'
    },
    align: {
      type: String,
      default: 'top'
    }
  },

  computed: {
    style () {
      const ret = {}

      if (this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`
        ret.marginRight = ret.marginLeft
      }

      return ret
    }
  },

  render (h) {
    return h(this.tag, {
      class: [
        'ods-row',
        this.justify !== 'start' ? `is-justify-${this.justify}` : '',
        this.align !== 'top' ? `is-align-${this.align}` : '',
        { 'ods-row--flex': this.type === 'flex' }
      ],
      style: this.style
    }, this.$slots.default)
  }
}
