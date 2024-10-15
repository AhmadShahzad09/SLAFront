<template>
    <div class="ods-chart"
        data-name="OdsChart"
         :class="{'overlap': overlap, 'fullwidth': type == 'singleLine' || type == 'singleBar'}">
        <slot name="legend"></slot>
        <ul class="chart_legend" v-if="type == 'pie' &amp;&amp; legend == true &amp;&amp; !this.$slots.legend">
            <li v-for="value in data.labels">{{ value }}</li>
        </ul>
        <div class="ods_title" v-if="this.$slots.title">{{ this.$slots.title['0'].children['0'].text }}</div>
        <div class="ct-chart"></div>
        <div class="ods_subtitle" v-if="this.$slots.subtitle">{{ this.$slots.subtitle['0'].children['0'].text }}
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import chartist from 'vue-chartist'

Vue.use(chartist)

const Chartist = Vue.chartist

/**
   ---------------
   COMPONENT CHART
   ---------------

   Parameters:
   - type : String        => singleLine, singleBar, gauge or pie
   - average : Boolean    => average line. Only available in singleLine and singleBar
   - orientation : String => horizontal or vertical. Only available in singleBar
   - symbol : String      => symbol of the measure to be displayed on tooltip. Ex: kg, %, etc
   - text : Boolean       => shows text inside a gauge. Only available in gauge
   - size : Number        => chart size. Only available in gauge
   **/

export default {
  name: 'OdsChart',
  version: '2.0.0',
  category: 'data',
  lastDate: '13/04/2020',
  syncStatus: 'not-applicable',
  props: {
    symbol: {
      type: String
    },
    objetiveText: {
      type: String
    },
    type: {
      type: String
    },
    size: {
      type: Number
    },
    text: {
      type: Boolean
    },
    average: {
      type: Boolean
    },
    legend: {
      type: Boolean
    },
    overlap: {
      type: Boolean
    },
    orientation: {
      type: String
    },
    data: {
      type: Object
    }
  },

  data: function () {
    return {
      currency: '',
      chartOptions: {},
      gaugeSize: 116,
      gaugeIndicatorSize: 19,
      chartColors: [
        '#696AE8',
        '#E8D769',
        '#F3A72A',
        '#B169E8',
        '#BBBBCA',
        '#b2c326',
        '#6b0392',
        '#f05b4f',
        '#dda458',
        '#eacf7d',
        '#86797d',
        '#0544d3',
        '#6188e2',
        '#a748ca'
      ]
    }
  },

  methods: {
    createAverageLine (data, orientation, objetive) {
      // vars
      let averageValue

      // average calc
      if (objetive) {
        averageValue = parseFloat(objetive)
      } else {
        averageValue = Chartist.getDataArray(this.getData())[0]
        const averageCount = averageValue.length
        averageValue = averageValue.reduce(
          (previous, current) => (current += previous)
        )
        averageValue /= averageCount
      }

      // create average line
      const projectTarget = {
        y (chartRect, bounds, value) {
          if (orientation === 'horizontal') {
            const targetLineX =
                chartRect.x1 + chartRect.width() / bounds.max * value

            return {
              x1: targetLineX,
              x2: targetLineX,
              y1: chartRect.y1,
              y2: chartRect.y2
            }
          } else {
            const targetLineY =
                (value - bounds.max) *
                (chartRect.y1 / (bounds.min - bounds.max)) +
                (value - bounds.min) * (chartRect.y2 / (bounds.max - bounds.min))

            return {
              x1: chartRect.x1,
              x2: chartRect.x2,
              y1: targetLineY,
              y2: targetLineY
            }
          }
        },

        x (chartRect, bounds, value) {
          if (orientation === 'horizontal') {
            const targetLineY =
                chartRect.y1 - chartRect.height() / bounds.max * value

            return {
              x1: chartRect.x1,
              x2: chartRect.x2,
              y1: targetLineY,
              y2: targetLineY
            }
          } else {
            const targetLineX =
                chartRect.x1 + chartRect.width() / bounds.max * value

            return {
              x1: targetLineX,
              x2: targetLineX,
              y1: chartRect.y1,
              y2: chartRect.y2
            }
          }
        }
      }

      const targetLine = projectTarget['y'](
        data.chartRect,
        data.bounds,
        averageValue.toFixed(1)
      )
      data.svg.elem('line', targetLine, 'ct-line ct-average-value')
      data.svg.elem('line', targetLine, 'ct-line ct-average-value-area')

      // average line tooltip
      const averageLine = this.$el.querySelector('.ct-average-value')
      const averageLineArea = this.$el.querySelector('.ct-average-value-area')
      let averageTooltip = document.createElement('div')
      averageTooltip.classList.add('ct-tooltip-average')
      if (objetive) {
        averageTooltip.innerHTML = this.objetiveText
          ? this.objetiveText +
            ': ' +
            averageValue.toLocaleString(undefined, {
              maximumFractionDigits: 2
            }) +
            this.symbol
          : `objetivo: ${averageValue.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}${this.symbol}`
      } else {
        averageTooltip.innerHTML = `Media: ${averageValue.toLocaleString(
          undefined,
          { maximumFractionDigits: 2 }
        )}${this.symbol}`
      }

      if (this.$el.querySelectorAll('.ct-tooltip-average').length < 1) {
        this.$el.querySelector('.ct-chart').appendChild(averageTooltip)
      }

      averageLineArea.addEventListener('mouseover', () => {
        averageTooltip = this.$el.querySelector('.ct-tooltip-average')
        averageTooltip.style.top =
            orientation === 'horizontal'
              ? Math.round(averageLineArea.getAttribute('y2')) + 20 + 'px'
              : Math.round(averageLineArea.getAttribute('y2')) + 'px'
        averageTooltip.style.left =
            orientation === 'horizontal'
              ? Math.round(averageLineArea.getAttribute('x2')) + 'px'
              : 'auto'
        averageTooltip.style.right =
            orientation === 'horizontal' ? 'auto' : undefined

        if (averageTooltip !== null) {
          averageTooltip.classList.add('tooltip-show')
        }
      })

      averageLineArea.addEventListener('mouseout', () => {
        averageTooltip = this.$el.querySelector('.ct-tooltip-average')

        if (averageTooltip !== null) {
          averageTooltip.classList.remove('tooltip-show')
        }
      })

      // positioning line behind
      data.svg._node.childNodes[0].appendChild(averageLine)
      data.svg._node.childNodes[0].appendChild(averageLineArea)
    },

    createTooltip () {
      const tooltip = document.createElement('div')
      tooltip.classList.add('ct-tooltip')

      if (this.$el.querySelectorAll('.ct-tooltip').length < 1) {
        this.$el.querySelector('.ct-chart').appendChild(tooltip)
      }
    },

    parseTooltip (object, xPos, yPos) {
      // create container and parse data
      const tooltip = this.$el.querySelector('.ct-tooltip')
      tooltip.innerHTML = ''
      const tooltipDescription = document.createElement('div')
      tooltipDescription.classList.add('ct-tooltip_description')
      tooltipDescription.innerText = object.getAttribute('ct:meta')
      const tooltipValue = document.createElement('div')
      tooltipValue.classList.add('ct-tooltip_data')
      tooltipValue.innerHTML =
          parseFloat(object.getAttribute('ct:value')).toLocaleString(undefined, {
            maximumFractionDigits: 2
          }) + this.currency
      tooltip.appendChild(tooltipValue)
      if (object.getAttribute('ct:meta') !== null) {
        tooltip.appendChild(tooltipDescription)
      }

      // set position
      if (tooltip !== null) {
        tooltip.style.left = xPos + 'px'
        tooltip.style.top = yPos + 'px'
        tooltip.classList.add('tooltip-show')
      }
    },

    createChart (type) {
      // vars
      let maxValue, minValue
      const chartStyle = this.type
      this.gaugeSize = this.size ? this.size : 116

      if (chartStyle === 'singleLine' || chartStyle === 'singleBar') {
        maxValue = Math.max.apply(
          null,
          Chartist.getDataArray(this.getData())[0].map(Math.abs)
        )
      } else {
        maxValue = 0
      }

      if (chartStyle === 'singleLine' || chartStyle === 'singleBar') {
        minValue = Math.min.apply(
          null,
          Chartist.getDataArray(this.getData())[0].map(Math.abs)
        )
      } else {
        minValue = 0
      }

      // chart common options
      if (
        this.$el.getAttribute('objetive') &&
          parseFloat(this.$el.getAttribute('objetive')) > maxValue
      ) {
        this.chartOptions.high =
            parseFloat(this.$el.getAttribute('objetive')) +
            parseFloat(this.$el.getAttribute('objetive')) * 0.2
      }
      if (
        this.$el.getAttribute('objetive') &&
          parseFloat(this.$el.getAttribute('objetive')) < minValue
      ) {
        this.chartOptions.low =
            parseFloat(this.$el.getAttribute('objetive')) -
            parseFloat(this.$el.getAttribute('objetive')) * 0.2
      }
      if (this.overlap) {
        this.$el.parentElement.style.position = 'relative'
        this.chartOptions.low = 0
      }
      this.chartOptions.fullWidth = true
      this.chartOptions.chartPadding = {
        left: this.overlap ? 78 : 0,
        right: this.overlap ? 68 : 30
      }

      // chart line and bars options
      if (chartStyle === 'singleLine' || chartStyle === 'singleBar') {
        this.chartOptions.height = 280
        this.chartOptions.lineSmooth = Chartist.Interpolation.cardinal({
          tension: 0
        })
        this.chartOptions.axisX = {
          labelOffset: {
            y: this.overlap ? 200 : 8
          },
          onlyInteger: false
          // showLabel: if this.overlap then false else true
        }
        this.chartOptions.axisY = {
          labelInterpolationFnc (value) {
            if (typeof value === 'number') {
              return value.toLocaleString()
            } else {
              return value
            }
          },
          scaleMinSpace: 40,
          showLabel: true,
          offset: this.overlap ? 0 : 42,
          labelOffset: {
            x: this.overlap ? 44 : -8,
            y: 4
          },
          onlyInteger: false,
          position: this.overlap ? 'end' : 'start'
        }
      }

      // chart gauge options
      if (chartStyle === 'gauge') {
        this.chartOptions.height = this.gaugeSize
        this.chartOptions.donut = true
        this.chartOptions.donutWidth =
            this.gaugeSize * this.gaugeIndicatorSize / 116
        this.chartOptions.startAngle = 0
        this.chartOptions.total = 100
        this.chartOptions.showLabel = false
        this.chartOptions.chartPadding = 0
      }

      // chart pie options
      if (chartStyle === 'pie') {
        this.chartOptions.height = this.gaugeSize
        this.chartOptions.donut = true
        this.chartOptions.donutWidth =
            this.gaugeSize * this.gaugeIndicatorSize / 116
        this.chartOptions.startAngle = 0
        this.chartOptions.showLabel = false
        this.chartOptions.chartPadding = 0
      }

      // define chart
      // eslint-disable-next-line
        return new type(
        this.$el.querySelector('.ct-chart'),
        this.getData(),
        this.chartOptions
      )
    },

    sigleBarChart (orientation) {
      // create chart
      if (orientation === 'horizontal') {
        this.$el.querySelector('.ct-chart').classList.add('ct-horizontal-bars')
        this.chartOptions.reverseData = true
        this.chartOptions.horizontalBars = true
      }
      const lineChart = this.createChart(Chartist.Bar)

      // on chart create
      lineChart.on('created', (data) => {
        // create tooltip
        this.createTooltip()

        // Positioning tooltip and parse content inside it
        const bars = this.$el.querySelectorAll('.ct-bar');
        [].forEach.call(bars, (bar, index) => {
          // rollover bar
          bar.addEventListener('mouseover', () => {
            if (orientation === 'horizontal') {
              return this.parseTooltip(
                bar,
                Math.round(bar.getAttribute('x2')),
                Math.round(bar.getAttribute('y2'))
              )
            } else {
              return this.parseTooltip(
                bar,
                Math.round(bar.getAttribute('x2')),
                Math.round(bar.getAttribute('y2')) - 12
              )
            }
          })

          bar.addEventListener('mouseout', () => {
            const tooltip = this.$el.querySelector('.ct-tooltip')

            if (tooltip !== null) {
              tooltip.classList.remove('tooltip-show')
            }
          })

          // rollover circle
          bar.nextElementSibling.addEventListener('mouseover', () => {
            if (orientation === 'horizontal') {
              return this.parseTooltip(
                bar,
                Math.round(bar.getAttribute('x2')),
                Math.round(bar.getAttribute('y2'))
              )
            } else {
              return this.parseTooltip(
                bar,
                Math.round(bar.getAttribute('x2')),
                Math.round(bar.getAttribute('y2')) - 12
              )
            }
          })

          bar.nextElementSibling.addEventListener(
            'mouseout',
            () => {
              const tooltip = this.$el.querySelector('.ct-tooltip')

              if (tooltip !== null) {
                tooltip.classList.remove('tooltip-show')
              }
            }
          )
        })

        if (this.average === true) {
          this.createAverageLine(data, orientation)
        }

        if (this.$el.getAttribute('objetive')) {
          this.createAverageLine(
            data,
            orientation,
            this.$el.getAttribute('objetive')
          )
        }

        this.$root.$emit('updatescroll')
        this.$root.$emit('dashboardcontainer-content-displayed')
      })

      // on chart draw
      lineChart.on('draw', (data) => {
        if (data.type === 'bar') {
          // create oval side
          data.group.append(
            new Chartist.Svg(
              'circle',
              {
                cx: data.x2,
                cy: orientation === 'horizontal' ? data.y2 : data.y2 + 8,
                r: orientation === 'horizontal' ? 5 : 8
              },
              'ct-slice-pie'
            )
          )

          // adjust size of line
          const newLine = new Chartist.Svg(
            'line',
            {
              x1: data.x1,
              x2: data.x2,
              y1: data.y1,
              y2: orientation === 'horizontal' ? data.y2 : data.y2 + 8,
              'ct:value':
                  orientation === 'horizontal' ? data.value.x : data.value.y,
              'ct:meta': data.meta
            },
            'ct-bar ct-vertical'
          )

          data.element.replace(newLine)
        }
      })
    },

    sigleLineChart () {
      // vars
      let tooltip = this.$el.querySelector('.chartist-tooltip')

      // create chart
      const lineChart = this.createChart(Chartist.Line)

      // on chart creater
      lineChart.on('created', (data) => {
        // create tooltip
        this.createTooltip()

        // Positioning tooltip and parse content inside it
        const values = this.$el.querySelectorAll('.ct-series');
        [].forEach.call(values, (value) => {
          const points = value.querySelectorAll('.ct-point');
          [].forEach.call(points, (point, index) => {
            const horizontalGridElement = this.$el.querySelector(
              `.ct-horizontal:nth-of-type(${index + 1})`
            )

            point.addEventListener('mouseover', () => {
              horizontalGridElement.classList.add('active')
              return this.parseTooltip(
                point,
                Math.round(point.getAttribute('cx')),
                Math.round(point.getAttribute('cy'))
              )
            })

            point.addEventListener('mouseout', () => {
              horizontalGridElement.classList.remove('active')
              tooltip = this.$el.querySelector('.ct-tooltip')

              if (tooltip !== null) {
                tooltip.classList.remove('tooltip-show')
              }
            })
          })
        })

        if (this.average === true) {
          this.createAverageLine(data)
        }

        if (this.$el.getAttribute('objetive')) {
          this.createAverageLine(
            data,
            undefined,
            this.$el.getAttribute('objetive')
          )
        }

        this.$root.$emit('updatescroll')
        this.$root.$emit('dashboardcontainer-content-displayed')
      })

      // on chart draw
      lineChart.on('draw', (data) => {
        // Replace point icon
        if (data.type === 'point') {
          const newCircle = new Chartist.Svg(
            'circle',
            {
              cx: data.x,
              cy: data.y,
              r: 6,
              'ct:value': data.value.y,
              'ct:meta': data.meta
            },
            'ct-point'
          )

          data.element.replace(newCircle)
        }
      })
    },

    gaugeChart () {
      // create chart
      const pipeChart = this.createChart(Chartist.Pie)
      this.$el.querySelector('.ct-chart').style.maxWidth =
          this.gaugeSize + 'px'

      // on chart creater
      pipeChart.on('created', (data) => {
        // create gauge rail
        const strokeWidth =
            this.gaugeSize * this.gaugeIndicatorSize / 116
        const gaugeRailAttrs = {
          r:
            (this.gaugeSize -
              this.gaugeSize * this.gaugeIndicatorSize / 116) /
            2,
          cx: data.chartRect.x2 / 2,
          cy: data.chartRect.y1 / 2,
          'stroke-width': strokeWidth + 'px'
        }

        data.svg.elem('circle', gaugeRailAttrs, 'ct-gaugeRail')
        data.svg._node.appendChild(this.$el.querySelector('.ct-series'))

        // create valor container
        const gaugeValorContainer = this.$el.querySelectorAll(
          '.ct-gaugeValorContainer'
        )
        if (gaugeValorContainer.length <= 0) {
          const valorContainer = document.createElement('div')
          valorContainer.classList.add('ct-gaugeValorContainer')
          if (this.getData()) {
            if (this.getData().series[0].value) {
              valorContainer.innerHTML =
                  this.getData().series[0].value.toLocaleString(undefined, {
                    maximumFractionDigits: 0
                  }) +
                  '<span class="symbol">' +
                  this.currency +
                  '</span>'
            } else if (this.getData().series[0]) {
              valorContainer.innerHTML = this.formatDecimals(
                this.getData().series[0],
                this.currency
              )
            } else {
              valorContainer.innerHTML = ''
            }
          }

          if (this.text === true) {
            this.$el.querySelector('.ct-chart').appendChild(valorContainer)
          }
        }

        this.$root.$emit('updatescroll')
        this.$root.$emit('dashboardcontainer-content-displayed')
      })

      // on chart draw
      pipeChart.on('draw', (data) => {})
    },

    pieChart () {
      // create chart
      const pipeChart = this.createChart(Chartist.Pie)
      this.$el.querySelector('.ct-chart').style.maxWidth = this.size + 'px'

      // on chart creater
      pipeChart.on('created', (data) => {
        // create tooltip
        this.createTooltip()

        // Positioning tooltip and parse content inside it
        const portions = this.$el.querySelectorAll('.ct-slice-donut');
        [].forEach.call(portions, (portion, index) => {
          // eslint-disable-next-line
            const horizontalGridElement = this.$el.querySelector(
            `.ct-horizontal:nth-of-type(${index + 1})`
          )

          portion.addEventListener('mouseover', () =>
            this.parseTooltip(
              portion,
              Math.round(portion.getAttribute('cx')),
              Math.round(portion.getAttribute('cy'))
            )
          )

          portion.addEventListener('mousemove', e =>
            this.parseTooltip(
              portion,
              e.clientX - this.$el.getBoundingClientRect().left,
              e.clientY - this.$el.getBoundingClientRect().top
            )
          )

          portion.addEventListener('mouseout', () => {
            const tooltip = this.$el.querySelector('.ct-tooltip')

            if (tooltip !== null) {
              tooltip.classList.remove('tooltip-show')
            }
          })
        })

        this.$root.$emit('updatescroll')
        this.$root.$emit('dashboardcontainer-content-displayed')
      })

      // on chart draw
      pipeChart.on('draw', (data) => {})
    },

    getChartToPrint () {
      const chartType = this.type
      const chartOrientation = this.orientation
      this.currency = this.symbol || ''

      switch (chartType) {
        case 'singleLine':
          return this.sigleLineChart()
        case 'singleBar':
          return this.sigleBarChart(chartOrientation)
        case 'gauge':
          return this.gaugeChart()
        case 'pie':
          return this.pieChart()
      }
    },

    getData () {
      return this.data
    },

    // Function to format the decimal part
    formatDecimals (number, symbol) {
      const index = number.toString().indexOf('.')

      if (index > -1) {
        const separatedNumbers = parseFloat(number).toLocaleString(undefined, { maximumFractionDigits: 1 }).split(',')
        const smallNumber = `,${separatedNumbers[1]}`

        return (
          parseFloat(separatedNumbers[0]).toLocaleString() +
            '<span class="smallNumber">' +
            smallNumber +
            '</span>' +
            '<span class="symbol">' +
            symbol +
            '</span>'
        )
      }
    }
  },

  mounted () {
    this.$nextTick(() => this.getChartToPrint())
  }
}
</script>
