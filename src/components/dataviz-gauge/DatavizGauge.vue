<template>
  <div class="ods-dataviz" :style="{ width: width }">
    <div class="ods-dataviz__header" v-if="title || $slots.toolbox">
      <component v-if="title" :is="titleTag" class="ods-dataviz__title">{{ title }}</component>
      <div class="ods-dataviz__toolbox" v-if="$slots.toolbox">
        <slot name="toolbox" />
      </div>
    </div>

    <chart
      ref="odsDataviz"
      :options="pie"
      :init-options="{ renderer: renderType }"
      :style="style"
      autoresize
    />
  </div>
</template>

<script>
import datavizCommon from '@/mixins/dataviz-common'
import 'echarts/lib/chart/pie'

export default {
  mixins: [datavizCommon],

  name: 'odsDatavizGauge',
  versionNumber: '1.0.0',
  category: 'charts',
  lastDate: '23/09/2020',
  componentName: 'odsDatavizGauge',

  props: {
    summary: {
      type: Boolean,
      default: true
    },
    summaryText: {
      type: String
    }
  },

  computed: {
    percentageValue () {
      const value = 100 - this.data.value
      return value > 0 ? value : 0
    },
    pie () {
      return {

        tooltip: {
          show: false
        },

        /**
         * Series config
         */

        animation: this.animation,
        animationEasingUpdate: 'sinusoidalInOut',
        series: [
          {
            type: 'pie',
            radius: ['60%', '90%'],
            hoverOffset: 0,
            hoverAnimation: false,
            data: [
              { value: this.data.value },
              { value: this.percentageValue }
            ],
            label: {
              show: false
            }
          }
        ],

        color: this.colors,

        /**
         * Title styles
         */

        title: {
          show: this.summary,
          text: `${this.data.value}%`,
          subtext: this.summaryText,
          left: 'center',
          top: 'center',
          textStyle: {
            fontSize: 32,
            lineHeight: 16,
            fontFamily: 'JetBrains Mono',
            fontWeight: 'normal',
            color: ['#051724']
          },
          subtextStyle: {
            fontSize: 12,
            lineHeight: 16,
            fontFamily: 'soho',
            color: ['#505D66']
          }
        }
      }
    }
  }
}
</script>
