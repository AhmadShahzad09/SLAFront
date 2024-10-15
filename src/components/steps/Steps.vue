<template>
  <div
    class="ods-steps"
    data-name="OdsSteps"
    :class="[
       !simple && 'ods-steps--' + direction,
       simple && 'ods-steps--simple',
       dots && 'ods-steps--dots'
     ]">
      <slot></slot>
  </div>
</template>

<script>
import Migrating from '@/addons/mixins/migrating'

export default {
  name: 'OdsSteps',
  version: '2.0.0',
  category: 'navigation',
  lastDate: '13/04/2020',
  syncStatus: 'aligned-extended',

  mixins: [Migrating],

  props: {
    dots: {
      type: Boolean,
      default: false
    },
    space: [Number, String],
    active: Number,
    direction: {
      type: String,
      default: 'horizontal'
    },
    alignCenter: Boolean,
    simple: Boolean,
    finishStatus: {
      type: String,
      default: 'finish'
    },
    processStatus: {
      type: String,
      default: 'process'
    }
  },

  data () {
    return {
      steps: [],
      stepOffset: 0
    }
  },

  methods: {
    getMigratingConfig () {
      return {
        props: {
          'center': 'center is removed.'
        }
      }
    }
  },

  watch: {
    active (newVal, oldVal) {
      this.$emit('change', newVal, oldVal)
    },

    steps (steps) {
      steps.forEach((child, index) => {
        child.index = index
      })
    }
  }
}
</script>
