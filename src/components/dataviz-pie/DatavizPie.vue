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

  name: 'odsDatavizPie',
  versionNumber: '1.0.0',
  category: 'charts',
  lastDate: '23/09/2020',
  componentName: 'odsDatavizPie',

  props: {
    /**
     * Tipo de gráfica (fina o completa)
     */

    type: {
      type: String,
      default: 'thin',
      validator: function (value) {
        return ['thin', 'complete', null].indexOf(value) !== -1
      }
    },

    /**
     * Tipo Rosetype
     */

    roseType: {
      type: String
    },

    /**
     * Active selected mode
     */

    selectedMode: {
      type: String,
      default: null,
      validator: function (value) {
        return ['single', 'multiple'].indexOf(value) !== -1
      }
    },

    /**
     * Mostrar labels de porcentajes
     */

    showLabels: {
      type: Boolean,
      default: false
    },

    /**
     * Mostrar datos completos en el centro
     */

    summary: {
      type: Boolean,
      default: false
    },
    summaryText: {
      type: String
    }
  },

  computed: {
    /**
     * Calculo del radio de la gráfcia, segun haya que dejar espacio o no
     * para la leyenda y condicionalmente si es rosetype.
     */

    pieRadius () {
      const legendSpace = this.legend ? 15 : 0
      if (this.roseType) {
        return ['0', `${90 - legendSpace}%`]
      } else {
        return this.type === 'thin'
          ? [`${75 - legendSpace}%`, `${90 - legendSpace}%`]
          : [`${90 - legendSpace}%`, '0']
      }
    },
    pie () {
      return {
        /**
         * Rosetype config
         */

        roseType: this.roseType,

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
          formatter: (params) => {
            let body = ''
            if (params.data.listValues) {
              body = this.createTooltipList({
                seriesName: params.data.name,
                color: params.color,
                data: params.data.value
              }, params.data.listValues)
            } else {
              body = this.createTooltipItem({
                seriesName: params.data.name,
                color: params.color,
                data: params.data.value
              })
            }
            return `<ul class="ods-dataviz__tooltip">${body}</ul>`
          }
        },

        /**
         * Series config
         */

        animation: this.animation,
        animationEasingUpdate: 'sinusoidalInOut',
        series: [
          {
            hoverOffset:
              this.type === 'thin' ? 2 : this.type === 'complete' ? 0 : 2,
            type: 'pie',
            radius: this.pieRadius,
            borderWidth: 1,
            data: this.data,
            itemStyle: {
              borderColor: ['#FFFFFF'],
              borderWidth: 1
            },
            selectedMode: this.selectedMode,
            symbolSize: 0,

            /**
             * Labels config
             */

            label: {
              show: this.showLabels,
              formatter: '{d}%',
              textStyle: {
                fontSize: 12
              },
              color: ['#505D66'],

              position: 'outside'
            },
            labelLine: {
              lineStyle: {
                color: ['#505D66']
              },
              length:
                this.type === 'complete' && this.height
                  ? this.height.replace('px', '') / 2 - (this.legend ? 30 : 0)
                  : 10
            }
          }
        ],

        /**
         * Colors
         */

        color: this.colors,

        /**
         * Title styles
         */

        title: {
          show: this.summary && this.type === 'thin',
          text: this.data.map((e) => e.value).reduce((a, b) => a + b),
          subtext: this.type === 'thin' && this.summaryText,
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
