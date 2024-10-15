import Vue from 'vue'
// import moment from 'moment'
import moment from 'moment-timezone'
import numeral from 'numeral'
import APPCONFIG from '../config/Config'

Vue.filter('formatNumber', function (value) {
  return numeral(value).format('0,0.[000]') // displaying other groupings/separators is possible, look at the docs
})
Vue.filter('formatNumberForm', function (number) {
  var decimalSeparator = '.'
  var thousandSeparator = ','

  // make sure we have a string
  var result = String(number)

  // split the number in the integer and decimals, if any
  var parts = result.split(decimalSeparator)
  if (parts[1] && parts[1][3]) {
    parts[1] = `${parts[1][0]}${parts[1][1]}${parts[1][2]}`
  }

  // if we don't have decimals, add .00
  /* if (!parts[1]) {
        parts[1] = '00'
      } */

  // reverse the string (1719 becomes 9171)
  result = parts[0].split('').reverse().join('')

  // add thousand separator each 3 characters, except at the end of the string
  result = result.replace(/(\d{3}(?!$))/g, '$1' + thousandSeparator)

  // reverse back the integer and replace the original integer
  parts[0] = result.split('').reverse().join('')

  // recombine integer with decimals
  return parts.join(decimalSeparator)
})
Vue.filter('formatNumberNoDecimals', function (value) {
  return numeral(value).format('0,0') // displaying other groupings/separators is possible, look at the docs
})

Vue.filter('max20', function (value) {
  if (value) {
    if (value.length > 20) {
      return (
        value.charAt(0) +
        value.charAt(1) +
        value.charAt(2) +
        value.charAt(3) +
        value.charAt(4) +
        value.charAt(5) +
        value.charAt(6) +
        value.charAt(7) +
        value.charAt(8) +
        value.charAt(9) +
        value.charAt(10) +
        value.charAt(11) +
        value.charAt(12) +
        value.charAt(13) +
        value.charAt(14) +
        value.charAt(15) +
        value.charAt(16) +
        value.charAt(17) +
        value.charAt(18) +
        value.charAt(19) +
        ' ...'
      )
    }
  }

  return value
})

Vue.filter('max50', function (value) {
  if (value) {
    if (value.length > 50) {
      let result = ''

      for (let i = 0; i < value.length; i++) {
        if (i < 50) {
          result = result + value[i]
        }
      }
      return result + ' ...'
    } else {
      return value
    }
  }
})

Vue.filter('max255', function (value) {
  if (value) {
    if (value.length > 255) {
      let result = ''

      for (let i = 0; i < value.length; i++) {
        if (i < 255) {
          result = result + value[i]
        }
      }
      return result + ' ...'
    } else {
      return value
    }
  }
})

Vue.filter('formatCurrency', function (value) {
  return numeral(value).format(`${APPCONFIG.currency}0,0.[00]`)
})
Vue.filter('formatCurrencyForm', function (number) {
  var decimalSeparator = '.'
  var thousandSeparator = ','
  var result = String(number)
  var parts = result.split(decimalSeparator)
  result = parts[0].split('').reverse().join('')
  result = result.replace(/(\d{3}(?!$))/g, '$1' + thousandSeparator)
  parts[0] = result.split('').reverse().join('')
  return APPCONFIG.currency + ' ' + parts.join(decimalSeparator)
})

Vue.filter('formatNumberPercent', function (value) {
  return numeral(value).format('0,0.[00]') + ' %' // displaying other groupings/separators is possible, look at the docs
})

Vue.filter('date', function (value, ms = false) {
  if (!value) return '--/--/--'
  return moment(value).tz(`${process.env.VUE_APP_TIMEZONE}`).format('DD/MM/YYYY h:mm A')
  // return moment(value).utc().format('DD/MM/YYYY h:mm A')
})
Vue.filter('date2', function (value, ms = false) {
  if (!value) return '--/--/--'
  return moment(value).tz(`${process.env.VUE_APP_TIMEZONE}`).format('DD/MM/YYYY')
})
Vue.filter('date3', function (value, ms = false) {
  if (!value) return '--/--/--'
  return moment(value).tz(`${process.env.VUE_APP_TIMEZONE}`)
})
Vue.filter('date4', function (value, ms = false) {
  if (!value) return '--/--/--'
  return moment(value).tz(`${process.env.VUE_APP_TIMEZONE}`).format('DD-MM-YYYY')
})
Vue.filter('datetime', function (value) {
  if (!value) return ''
  return moment(new Date(Number(`${value}000`))).tz(`${process.env.VUE_APP_TIMEZONE}`).format('DD/MM/YYYY hh:mm A')
})

Vue.filter('formatIdSupplyAddress', function (supplyAddress) {
  var number = supplyAddress.replace(/\-/g, '') // Remove illegal characters
  if (number.length > 4) number = number.replace(/.{4}/, '$&-')
  if (number.length > 10) number = number.replace(/.{10}/, '$&-')
  if (number.length > 15) number = number.replace(/.{15}/, '$&-')

  return number.substring(0, 20)
})

Vue.filter('formatSupplyAddress', function (supplyAddress, governorate) {
  var number = supplyAddress.replace(/\-/g, '') // Remove illegal characters
  var result = 'Unit: ' + number.substring(0, 4) + ' Building: ' + number.substring(4, 9) + ' Road: ' + number.substring(9, 13) + ' Block: ' + number.substring(13, 17) + ' ' + governorate
  return result
})
