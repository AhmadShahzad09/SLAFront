export default {
  functional: true,

  name: 'OdsDivider',
  version: '2.0.0',
  category: 'other',
  lastDate: '13/04/2020',
  syncStatus: 'aligned',
  props: {
    direction: {
      type: String,
      default: 'horizontal',
      validator (val) {
        return ['horizontal', 'vertical'].indexOf(val) !== -1
      }
    },

    contentPosition: {
      type: String,
      default: 'center',
      validator (val) {
        return ['left', 'center', 'right'].indexOf(val) !== -1
      }
    },

    textBackground: {
      type: String,
      default: 'white'
    }
  },

  render (h, context) {
    const $slots = context.slots()
    const { direction, contentPosition, textBackground } = context.props
    return (
      <div class={['ods-divider', `ods-divider--${direction}`]}>
        {
          $slots.default && direction !== 'vertical'
            ? <div class={['ods-divider__text', `is-${contentPosition}`]} style={`background-color: ${textBackground}`}>{$slots.default}</div>
            : null
        }
      </div>
    )
  }
}
