import Picker from '@/components/date-picker/picker/Picker'
import TimePanel from '@/components/date-picker/panel/time'
import TimeRangePanel from '@/components/date-picker/panel/time-range'

export default {
  mixins: [Picker],

  name: 'OdsTimePicker',
  version: '2.0.0',
  category: 'form',
  lastDate: '13/04/2020',
  props: {
    isRange: Boolean,
    arrowControl: Boolean,
    showButtons: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      type: ''
    }
  },

  watch: {
    isRange (isRange) {
      if (this.picker) {
        this.unmountPicker()
        this.type = isRange ? 'timerange' : 'time'
        this.panel = isRange ? TimeRangePanel : TimePanel
        this.mountPicker()
      } else {
        this.type = isRange ? 'timerange' : 'time'
        this.panel = isRange ? TimeRangePanel : TimePanel
      }
    }
  },
  created () {
    this.type = this.isRange ? 'timerange' : 'time'
    this.panel = this.isRange ? TimeRangePanel : TimePanel
  }
}
