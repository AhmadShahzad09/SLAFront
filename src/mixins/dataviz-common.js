import ECharts from 'vue-echarts'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataZoom'
import 'zrender/lib/svg/svg'

export default {
  components: {
    chart: ECharts
  },
  props: {
    /**
    * Datos para pintar la gráfica
    */

    data: {
      type: [Object, Array, Number],
      required: true
    },

    /**
    * Svg o canvas
    */

    renderType: {
      type: String,
      default: 'svg'
    },

    /**
    * opción para mostrar el tooltip
    */

    showTooltip: {
      type: Boolean,
      default: true
    },
    tooltipSuffixValue: {
      type: String
    },
    tooltipPosition: {
      type: Array,
      default: null
    },

    /**
    * Hover de los items
    */

    trigger: {
      type: String,
      default: 'item',
      validator: function (value) {
        return ['item', 'axis'].indexOf(value) !== -1
      }
    },

    /**
    * Título de la gráfica
    */

    title: {
      type: String
    },
    titleTag: {
      type: String,
      default: 'h3',
      validator: function (value) {
        return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(value) !== -1
      }
    },

    /**
    * opción para mostrar la leyenda
    */

    legend: {
      type: Boolean,
      default: false
    },
    legendPosition: {
      type: String,
      default: 'top',
      validator: function (value) {
        return ['top', 'bottom'].indexOf(value) !== -1
      }
    },
    legendAlign: {
      type: String,
      default: 'left',
      validator: function (value) {
        return ['left', 'center'].indexOf(value) !== -1
      }
    },

    /**
    * Animation
    */

    animation: {
      type: Boolean,
      default: false
    },

    /**
    * Colores de la gráfica
    */

    colors: {
      type: Array,
      default: () => {
        return [
          '#3982D0',
          '#D96D73',
          '#5A59A6',
          '#6DB6A1',
          '#F78B41',
          '#5DB9E0',
          '#418A8B',
          '#A2578D',
          '#E5B75D',
          '#234E63',
          '#90B9E5',
          '#A74460',
          '#A2A2CD',
          '#50826F',
          '#FABD94',
          '#3B98AB',
          '#8AC7C8',
          '#6D466B',
          '#F0D7A4',
          '#356A8A',
          '#EAADB0',
          '#484E70',
          '#ADD6CA',
          '#BB5F26',
          '#A4D8EE',
          '#365D59',
          '#CC9FBF',
          '#B18538',
          '#63A6C8'
        ]
      }
    },

    /**
    * Ancho y alto de la gráfica
    */

    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String
    },

    /**
     * Props comunes de los labels
     * @prop showAxis - Mostrar la legenda en X
     * @prop showYAxis - Mostrar la legenda en Y
     * @prop XAxisName - nombre del eje X
     * @prop YAxisName - nombre del eje Y
     * @prop showXAxisLine - Linea separadora en la leyenda X
     * @prop showYAxisLine - Linea separadora en la leyenda Y
     * @prop yAxisLabelSuffix - prefijo de los labels Y
     * @prop xAxisLabelSuffix - prefijo de los labels X
     * @prop rotateLabel - Rotación de la legenda inferior
     * @prop interval - intervalo entre los valores de los labels
     */

    showXLabels: {
      type: Boolean,
      default: true
    },
    showYLabels: {
      type: Boolean,
      default: true
    },
    XAxisName: {
      type: String
    },
    YAxisName: {
      type: String
    },
    YAxisNamePadding: {
      type: Number
    },
    showXAxisLine: {
      type: Boolean,
      default: true
    },
    showYAxisLine: {
      type: Boolean,
      default: true
    },
    yAxisLabelSuffix: {
      type: String
    },
    xAxisLabelSuffix: {
      type: String
    },
    rotateLabel: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number
    },

    /**
    * Lineas interiores
    */

    showXSplitLine: {
      type: Boolean,
      default: true
    },
    showYSplitLine: {
      type: Boolean,
      default: true
    },

    /**
    * zoom
    */

    zoom: {
      type: Boolean,
      default: false
    },
    showXFilterZoom: {
      type: Boolean,
      default: false
    },
    showYFilterZoom: {
      type: Boolean,
      default: false
    },

    /**
     * fusión/apilamientos de las series
     */
    stack: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    style () {
      return {
        width: this.width,
        height: this.height && this.height
      }
    },
    bottomSpace () {
      // suma del espacio necesario de la leyenda, de eliminar el eje X, dar espacio a los labels del eje Y y el filtro de zoom
      return (this.legendPosition === 'bottom' && this.legend ? 45 : 0) +
        (this.showXLabels === false ? 15 : 0) +
        (this.zoom && this.showXFilterZoom ? 50 : 0)
    },
    gridCommon () {
      return {
        containLabel: true,
        top: (this.legend && this.legendPosition !== 'bottom') ? 45 : 15,
        bottom: this.bottomSpace + (this.XAxisName ? 32 : 0)
      }
    },
    legendCommon () {
      return {
        show: this.legend,
        itemWidth: 15,
        itemGap: 20,
        icon: 'roundRect',
        bottom: this.legendPosition === 'bottom' ? 0 : null,
        left: this.legendAlign === 'left' ? 'left' : 'center',
        textStyle: {
          fontFamily: 'soho',
          fontSize: 12,
          padding: [3, 0, 0, 0],
          color: ['#505D66']
        }
      }
    },
    dataZoom () {
      const commonData = {
        dataBackground: {
          lineStyle: {
            opacity: 0
          },
          areaStyle: {
            color: ['#D9E7F1'],
            opacity: 1
          }
        },
        borderColor: 'transparent',
        handleStyle: {
          color: ['#505D66']
        },
        handleIcon: 'path://M4,10.5v9C4,19.8,3.8,20,3.5,20H2.7v10H1.2V20H0.5C0.2,20,0,19.8,0,19.5v-9C0,10.2,0.2,10,0.5,10h0.7V0h1.5v10 h0.8C3.8,10,4,10.2,4,10.5z',
        fillerColor: 'rgba(144, 144, 206, .1)',
        backgroundColor: 'rgba(184, 184, 246, .1)',
        textStyle: {
          fontFamily: 'soho',
          fontSize: 12,
          color: ['#505D66']
        }
      }

      return [
        {
          ...commonData,
          show: this.zoom && this.showXFilterZoom,
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'none',
          bottom: this.legendPosition === 'bottom' ? 45 : 0

        },
        {
          ...commonData,
          show: this.zoom && this.showYFilterZoom,
          type: 'slider',
          yAxisIndex: 0,
          filterMode: 'none'

        },
        {
          disabled: !this.zoom,
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'none'

        },
        {
          disabled: !this.zoom,
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'none'
        }
      ]
    },

    /**
    * Tooltip common config
    */

    tooltipCommon () {
      return {
        padding: [0],
        extraCssText: 'border-radius: 1px',
        formatter: this.tooltipFormatCommon,
        show: this.showTooltip,
        trigger: this.trigger,
        borderColor: ['#E6E8E9'],
        textStyle: {
          fontFamily: 'soho',
          color: ['#051724']
        },
        backgroundColor: ['#FFFFFF'],
        appendToBody: true,
        position: this.tooltipPosition
      }
    },

    /**
    * Axis label config
    */

    axisCommon () {
      return {
        xAxis: {
          name: this.XAxisName,
          nameLocation: 'middle',
          nameTextStyle: {
            padding: [16, 16, 16, 16],
            fontSize: 12,
            fontFamily: 'soho',
            color: ['#505D66']
          },
          axisLine: {
            show: this.showXAxisLine,
            lineStyle: {
              color: ['#505D66']
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            ...this.splitLine,
            show: this.showXSplitLine,
            lineStyle: {
              color: ['#D7DADC']
            }
          },
          axisLabel: {
            show: this.showXLabels,
            fontSize: 11,
            fontFamily: 'soho',
            color: ['#505D66'],
            formatter: !this.xAxisLabelSuffix ? '{value}' : `{value} ${this.xAxisLabelSuffix}`,
            rotate: this.rotateLabel ? 45 : 0
          }
        },

        yAxis: {
          name: this.YAxisName,
          nameLocation: 'middle',
          nameTextStyle: {
            padding: [0, 16, this.YAxisNamePadding || (this.showYLabels ? 32 : 0), 16],
            fontSize: 12,
            fontFamily: 'soho',
            color: ['#505D66']
          },
          interval: Number.isInteger(this.interval) ? this.interval : null,
          axisLine: {
            show: this.showYAxisLine,
            lineStyle: {
              color: ['#505D66']
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: this.showYLabels,
            fontSize: 11,
            fontFamily: 'soho',
            color: ['#505D66'],
            formatter: !this.yAxisLabelSuffix ? '{value}' : `{value} ${this.yAxisLabelSuffix}`

          },
          splitLine: {
            ...this.splitLine,
            show: this.showYSplitLine,
            lineStyle: {
              color: ['#D7DADC']
            }
          }
        }
      }
    }
  },
  methods: {
    tooltipFormatCommon (params) {
      let body = ''

      if (this.trigger === 'axis') {
        params.forEach(item => {
          const listsData = this.data.lines[item.componentIndex].listValues && this.data.lines[item.componentIndex].listValues

          if (listsData) {
            body += listsData[item.dataIndex]
              ? this.createTooltipList(item, listsData[item.dataIndex])
              : this.createTooltipItem(item)
          } else {
            body += this.createTooltipItem(item)
          }
        })
      } else {
        const listsData = this.data.lines[params.componentIndex].listValues && this.data.lines[params.componentIndex].listValues
        if (listsData && listsData[params.dataIndex]) {
          body += this.createTooltipList(params, listsData[params.dataIndex])
        } else {
          body = this.createTooltipItem(params)
        }
      }
      return `<ul class="ods-dataviz__tooltip">${body}</ul>`
    },

    createTooltipItem (item) {
      return `<li class="ods-dataviz__tooltip__item" style="border-left-color: ${item.color}">
        ${item.seriesName} 
        <span class="ods-dataviz__tooltip__value">${item.data} ${this.tooltipSuffixValue || ''}</span>
      </li>`
    },

    createTooltipList (item, data) {
      let lists = ''
      data.forEach(item => {
        lists += `<li class="ods-dataviz__tooltip__list__item">
          ${item.name}: <span ${item.color ? `style='color: ${item.color}'` : ''}>${item.value}</span>
        </li>`
      })

      return `<li class="ods-dataviz__tooltip__item" style="border-left-color: ${item.color}">
        <ul class="ods-dataviz__tooltip__list">
          <li class="ods-dataviz__tooltip__list__title">
            ${item.seriesName} 
            <span class="ods-dataviz__tooltip__value">${item.data} ${this.tooltipSuffixValue || ''}</span>
          </li>
          ${lists}
        </ul>
      </li>`
    }
  }
}
