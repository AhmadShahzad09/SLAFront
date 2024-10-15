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
      :options="line"
      :init-options="{ renderer: renderType }"
      autoresize
    />
  </div>
</template>

<script>
import datavizCommon from '@/mixins/dataviz-common'
import 'echarts/lib/chart/line'

export default {
  mixins: [datavizCommon],
  name: 'odsDatavizBar',
  versionNumber: '1.0.0',
  category: 'charts',
  lastDate: '23/09/2020',
  componentName: 'odsDatavizBar',

  props: {
    /**
     * Espacio en el comienzo y final de la gráfica
     */

    boundaryGap: {
      type: Boolean,
      default: false
    },

    /**
     * Suavizado en el corte de las lineas
     */

    smoothLines: {
      type: Boolean,
      default: false
    },

    /**
     * Espacio necesario para las leyendas con sufijos al ser muy largas
     */

    leftSpace: {
      type: Number
    },
    rightSpace: {
      type: Number,
      default: 0
    }
  },

  computed: {
    line () {
      return {
        /**
         * Grid config
         */

        grid: {
          ...this.gridCommon,
          right: (this.showYFilterZoom ? 60 : 15) + this.rightSpace,
          left: this.leftSpace || 15 + (this.YAxisName ? 32 : 0)
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
            type: 'line',
            lineStyle: {
              color: ['#505D66'],
              type: 'dotted',
              width: 1
            }
          }
        },

        /**
         * Labels options
         */

        xAxis: {
          ...this.axisCommon.xAxis,
          data: this.data.xAxis,
          type: 'category',
          boundaryGap: this.boundaryGap
        },
        yAxis: {
          ...this.axisCommon.yAxis,
          type: 'value',
          data: this.data.xAxis
        },

        /**
         * Series config
         */

        animation: this.animation,
        animationEasingUpdate: 'sinusoidalInOut',
        series: this.data.lines.map((item) => {
          return {
            name: item.name,
            type: 'line',
            data: item.values,
            symbolSize: 8,
            smooth: this.smoothLines,
            symbol: 'circle',
            areaStyle: item.area && {
              opacity: 0.4
            },
            stack: this.stack ? 'allInOne' : null
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
