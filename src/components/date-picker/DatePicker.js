import Picker from './picker/Picker'
import DatePanel from './panel/date'
import DateRangePanel from './panel/date-range'

const getPanel = function (type) {
  if (type === 'daterange' || type === 'datetimerange') {
    return DateRangePanel
  }
  return DatePanel
}

export default {
  mixins: [Picker],

  name: 'OdsDatePicker',
  versionNumber: '2.0.1',
  category: 'form',
  lastDate: '02/07/2020',
  componentName: 'OdsDatePicker',
  syncStatus: 'diverged',

  props: {
    type: {
      type: String,
      default: 'date'
    },
    timeArrowControl: Boolean
  },

  watch: {
    type (type) {
      if (this.picker) {
        this.unmountPicker()
        this.panel = getPanel(type)
        this.mountPicker()
      } else {
        this.panel = getPanel(type)
      }
    }
  },

  created () {
    this.panel = getPanel(this.type)
  }
}
