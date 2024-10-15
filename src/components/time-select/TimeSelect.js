import Picker from '@/components/date-picker/picker/Picker'
import Panel from '@/components/date-picker/panel/time-select'

export default {
  mixins: [Picker],

  name: 'OdsTimeSelect',
  version: '2.0.0',
  category: 'form',
  lastDate: '13/04/2020',
  componentName: 'OdsTimeSelect',

  props: {
    type: {
      type: String,
      default: 'time-select'
    }
  },

  beforeCreate () {
    this.panel = Panel
  }
}
