<template>
  <div
    class="ods-step"
    :style="style"
    :class="[
      !isSimple && `is-${$parent.direction}`,
      isSimple && 'is-simple',
      isLast && !space && !isCenter && 'is-flex',
      isCenter && !isVertical && !isSimple && 'is-center'
     ]">
    <!-- icon & line -->
    <div
      class="ods-step__head"
      :class="`is-${currentStatus}`">
      <div
        class="ods-step__line"
        :style="isLast ? '' : { marginRight: $parent.stepOffset + 'px' }"
      >
        <span class="ods-step__line-inner" :style="lineStyle"></span>
      </div>

      <div class="ods-step__icon" :class="`is-${icon ? 'icon' : 'text'}`">
        <slot
          v-if="currentStatus !== 'success' && currentStatus !== 'error'"
          name="icon">
          <span v-if="icon" class="ods-step__icon-inner" :class="[icon]"></span>
          <div class="ods-step__icon-inner" v-if="!icon && !isSimple && !this.$parent.dots">{{ index + 1 }}</div>
          <div class="ods-step__icon-inner" v-if="!icon && !isSimple && this.$parent.dots">
            <span class="ods-step__dot"></span>
          </div>
        </slot>
        <span
          v-else
          :class="['ods-icon-' + (currentStatus === 'success' ? 'checkmark-2' : 'close')]"
          class="ods-step__icon-inner is-status"
        >
        </span>
      </div>
    </div>
    <!-- title & description -->
    <div class="ods-step__main">
      <div
        class="ods-step__title"
        ref="title"
        :class="['is-' + currentStatus]">
        <span
          ref="stepTitle"
          :style="{marginLeft: titleOffset}"><slot name="title">{{ title }}</slot>
        </span>
      </div>
      <div v-if="isSimple" class="ods-step__arrow"></div>
      <div
        v-else
        class="ods-step__description"
        :class="['is-' + currentStatus]">
        <span
          ref="stepDescription"
          :style="{marginLeft: descriptionOffset}">
          <slot name="description">{{ description }}</slot>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OdsStep',
  props: {
    title: String,
    icon: String,
    description: String,
    status: String
  },

  data () {
    return {
      index: -1,
      lineStyle: {},
      internalStatus: '',
      titleOffset: '',
      descriptionOffset: ''
    }
  },

  beforeCreate () {
    this.$parent.steps.push(this)
  },

  beforeDestroy () {
    const steps = this.$parent.steps
    const index = steps.indexOf(this)
    if (index >= 0) {
      steps.splice(index, 1)
    }
  },

  computed: {
    currentStatus () {
      return this.status || this.internalStatus
    },
    prevStatus () {
      const prevStep = this.$parent.steps[this.index - 1]
      return prevStep ? prevStep.currentStatus : 'wait'
    },
    isCenter () {
      return this.$parent.alignCenter
    },
    isVertical () {
      return this.$parent.direction === 'vertical'
    },
    isSimple () {
      return this.$parent.simple
    },
    isLast () {
      const parent = this.$parent
      return parent.steps[parent.steps.length - 1] === this
    },
    stepsCount () {
      return this.$parent.steps.length
    },
    space () {
      const { isSimple, $parent: { space } } = this
      return isSimple ? '' : space
    },
    style: function () {
      const style = {}
      const parent = this.$parent
      const len = parent.steps.length

      const space = (typeof this.space === 'number'
        ? this.space + 'px'
        : this.space
          ? this.space
          : 100 / (len - (this.isCenter ? 0 : 1)) + '%')
      style.flexBasis = space
      if (this.isVertical) return style
      if (this.isLast) {
        style.maxWidth = 100 / this.stepsCount + '%'
      } else {
        style.marginRight = -this.$parent.stepOffset + 'px'
      }

      return style
    }
  },

  methods: {
    updateStatus (val) {
      const prevChild = this.$parent.$children[this.index - 1]

      if (val > this.index) {
        this.internalStatus = this.$parent.finishStatus
      } else if (val === this.index && this.prevStatus !== 'error') {
        this.internalStatus = this.$parent.processStatus
      } else {
        this.internalStatus = 'wait'
      }

      if (prevChild) prevChild.calcProgress(this.internalStatus)
    },

    calcProgress (status) {
      let step = 100
      const style = {}

      style.transitionDelay = 150 * this.index + 'ms'
      if (status === this.$parent.processStatus) {
        step = this.currentStatus !== 'error' ? 0 : 0
      } else if (status === 'wait') {
        step = 0
        style.transitionDelay = (-150 * this.index) + 'ms'
      }

      style.borderWidth = step && !this.isSimple ? '1px' : 0
      this.$parent.direction === 'vertical'
        ? style.height = step + '%'
        : style.width = step + '%'

      this.lineStyle = style
    }
  },

  mounted () {
    const unwatch = this.$watch('index', val => {
      this.$watch('$parent.active', this.updateStatus, { immediate: true })
      this.$watch('$parent.processStatus', () => {
        const activeIndex = this.$parent.active
        this.updateStatus(activeIndex)
      }, { immediate: true })
      unwatch()
    })
  }
}
</script>
