<template>
    <a data-name="OdsKpi" class="ods-kpi" :href="href ? href : ''" :class="{'ods-kpi--no-href': !href}">
        <ul class="ods-kpi__list" :class="{center: center}">
            <li class="ods-kpi__number">
                <div class="kpi_circle">
                    <span>{{ ammount }}</span>
                    <span class="symbol">{{ unit }}</span>
                </div>
            </li>
            <li class="kpi_title" v-if="$slots['title']">
                <slot name="title"></slot>
            </li>
            <li class="kpi_resume" v-if="resume">
              <span>{{ resume }}</span>

            </li>
            <li class="kpi_percentage" :class="positivePercentage ? 'positive' : 'negative'" v-if="percentage">
                <div class="ods-icon triangle" v-show="triangle">
                    <div class="icon">
                        <svg width="9" height="8" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.5 0L9 8H0z" fill="#000000" fill-rule="evenodd"></path>
                        </svg>
                    </div>
                </div>
                <span class="percentage">{{ percentage }}</span>
            </li>
            <li class="kpi_arrow" v-show="href">
                <div class="ods-icon">
                    <div class="icon">
                        <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(-1 0 0 1 18 -5)" fill="none" fill-rule="evenodd">
                                <rect fill="#FFF" x="2" y="10" width="16" height="1" rx=".5"></rect>
                                <path stroke="#FFF" stroke-linecap="round" stroke-linejoin="round"
                                      d="M7.495 5L2 10.5l5.495 5.501"></path>
                            </g>
                        </svg>
                    </div>
                </div>
            </li>
            <ul v-if="icons">
              <li class="ods-kpi__kpi-list__kpi-icons-row" v-for="icon in icons">
                <div class="ods-kpi__kpi-list__kpi-icons-row__icon">
                  <span v-html="icon.icon"></span>
                  <span class="ods-kpi__kpi-list__kpi-icons-row__number">{{ icon.ammount }}</span>
              </div>
              </li>
            </ul>
        </ul>
    </a>
</template>

<script>
export default {
  name: 'OdsKpi',
  version: '2.0.0',
  category: 'data',
  lastDate: '13/04/2020',
  syncStatus: 'not-applicable',
  props: {
    ammount: { type: String },
    unit: { type: String },
    resume: { type: String },
    percentage: { type: Number },
    icons: { type: Array },
    triangle: { type: Boolean },
    center: { type: Boolean },
    href: { type: String }
  },
  methods: {
    // Function to format the decimal part
    formatDecimals () {
      const slotContent = this.ammount
      if (slotContent) {
        const number = slotContent[0].data.attrs.text
        const kpiNumber = this.$refs.kpiCircle
        const symbol = this.unit && this.unit.elm

        if (number) {
          if (number !== 0 && number !== '0.0' && number !== '0') {
            let index
            if (number.toString().indexOf('.') >= 0) {
              index = number.toString().indexOf('.')
            } else {
              index = number.toString().indexOf('/')
            }

            if (index >= 0) {
              let separatedNumbers, smallNumber
              const newSpan = document.createElement('span')
              newSpan.classList.add('smallNumber')
              if (number.toString().indexOf('.') >= 0) {
                separatedNumbers = number.split('.')
              } else {
                separatedNumbers = number.split('/')
              }
              kpiNumber.innerText = parseFloat(separatedNumbers[0]).toLocaleString()
              if (number.toString().indexOf('.') >= 0) {
                smallNumber = `,${separatedNumbers[1]}`
              } else {
                smallNumber = `/${separatedNumbers[1]}`
              }
              newSpan.innerText = smallNumber

              if (separatedNumbers[0].length < 4) {
                kpiNumber.appendChild(newSpan)
              }

              if (symbol) {
                kpiNumber.appendChild(symbol)
              }
            }
          } else {
            if (kpiNumber) {
              kpiNumber.innerText = 0
              if (symbol) {
                kpiNumber.appendChild(symbol)
              }
            }
          }
        } else {
          if (kpiNumber) {
            kpiNumber.innerText = 0
            if (symbol) {
              kpiNumber.appendChild(symbol)
            }
          }
        }
      }
    },

    // Format number. Example= 1200 => 1.200
    numberWithCommas () {
      const slotContent = this.ammount
      if (slotContent) {
        const number = slotContent[0].data.attrs.text
        const formatNumber = Number(number)

        if (number) {
          if (this.ammount.elm) {
            this.ammount.elm.innerText = formatNumber.toLocaleString()
          }
        }
      }
    }
  },

  computed: {
    positivePercentage () {
      return this.percentage > 0
    }
  }
}
</script>
