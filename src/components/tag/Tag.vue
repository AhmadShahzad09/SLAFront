<script>
export default {
  name: 'OdsTag',
  version: '2.0.0',
  category: 'data',
  lastDate: '13/04/2020',
  syncStatus: 'aligned',
  props: {
    text: String,
    closable: Boolean,
    type: String,
    hit: Boolean,
    disableTransitions: Boolean,
    color: String,
    size: String,
    effect: {
      type: String,
      default: 'light',
      validator (val) {
        return ['dark', 'light', 'plain'].includes(val)
      }
    }
  },
  methods: {
    handleClose (event) {
      event.stopPropagation()
      this.$emit('close', event)
    },
    handleClick (event) {
      this.$emit('click', event)
    }
  },
  computed: {
    tagSize () {
      return this.size || (this.$ONESAITDS || {}).size
    }
  },
  render (h) {
    const { type, tagSize, hit, effect } = this
    const classes = [
      'ods-tag',
      type ? `ods-tag--${type}` : '',
      tagSize ? `ods-tag--${tagSize}` : '',
      effect ? `ods-tag--${effect}` : '',
      hit && 'is-hit',
      this.closable && 'ods-tag--is-closable'
    ]
    const tagEl = (
      <span data-name="OdsTag" class={classes} style={ { backgroundColor: this.color } } on-click={ this.handleClick }>
        <span class="ods-tag__content">{ this.$slots.default }</span>
        { this.closable && <span class="ods-tag__close ods-icon-close" on-click={this.handleClose}></span> }
      </span>
    )

    return this.disableTransitions ? tagEl : <transition name="ods-zoom-in-center">{ tagEl }</transition>
  }
}
</script>
