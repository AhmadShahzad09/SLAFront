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
      :style="style"
      :options="bar"
      :init-options="{ renderer: renderType }"
      autoresize
    />
  </div>
</template>

<script>
import datavizCommon from '@/mixins/dataviz-common'
import 'echarts/lib/chart/bar'

export default {
  mixins: [datavizCommon],
  name: 'odsDatavizBar',
  versionNumber: '1.0.0',
  category: 'charts',
  lastDate: '23/09/2020',
  componentName: 'odsDatavizBar',

  props: {
    /**
     * Instanciar el componente como tipo barra horizontal
     */
    horizontal: {
      type: Boolean,
      default: false
    },

    /**
     * Ancho de la barra y separación entre series
     */

    barWidth: {
      type: Number
    },
    barGap: {
      type: Number
    }
  },

  computed: {
    bar () {
      return {
        /**
         * grid config
         */

        grid: {
          ...this.gridCommon,
          right: this.showYFilterZoom ? 60 : 15,
          left: 15 + (this.YAxisName ? 32 : 0)
        },

        /**
         * legend config
         */

        legend: {
          ...this.legendCommon
        },

        /**
         * tooltip config
         */

        tooltip: {
          ...this.tooltipCommon,
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: ['#E6E8E9']
            },
            z: -1
          }
        },

        /**
         * bars config
         */

        barWidth: this.barWidth && this.barWidth,
        barGap: this.barGap ? `${this.barGap}%` : null,

        /**
         * Labels options
         */

        xAxis: {
          ...this.axisCommon.xAxis,
          data: !this.horizontal ? this.data.xAxis : null,
          type: this.horizontal ? 'value' : 'category'
        },
        yAxis: {
          ...this.axisCommon.yAxis,
          type: this.horizontal ? 'category' : null,
          data: this.horizontal ? this.data.xAxis : null
        },

        /**
         * Animations
         */

        animation: this.animation,
        animationEasingUpdate: 'sinusoidalInOut',

        /**
         * Series config
         */

        series: this.data.lines.map((item) => {
          return {
            name: item.name,
            type: 'bar',
            stack: this.stack ? 'allInOne' : null,
            data: item.values,
            itemStyle: {
              borderColor: ['#FFFFFF'],
              borderWidth: this.stack ? 1 : 0
            }
          }
        }),

        /**
         * Bar colors
         */

        color: this.colors,

        /**
         * zoom
         */

        dataZoom: this.dataZoom
      }
    }
  }
}
</script>
