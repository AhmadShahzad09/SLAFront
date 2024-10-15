/* eslint-disable no-console */
const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')

console.info("🚀 Let's build this thing!")
const start = new Date()

/**
 * Update the index file
 */

console.info('📝 Updating index file')
require('./update-index-file')

/**
 * Get the binary for vue-cli-service
 */

const vueCliServicePath = getPath('../node_modules/.bin/vue-cli-service')

/**
 * Build the main lib, with all components packaged into a plugin
 */

console.info('🏗 Building main library')

execSync(
  `${vueCliServicePath} build src/components/index.js --target lib --formats umd-min --name index --dest lib/theme-onesait`
)

fs.rename('lib/theme-onesait/index.umd.min.js', 'lib/index.js')
fs.unlink('lib/theme-onesait/index.umd.min.js.map')

const end = new Date()
console.log(`🏗 Building main library: ${toHHMMSS(`${(end - start) / 1000} s`)}`)

/**
 * Function to convert the time format
 */

function toHHMMSS (s) {
  var secNum = parseInt(s, 10) // don't forget the second param
  var hours = Math.floor(secNum / 3600)
  var minutes = Math.floor((secNum - (hours * 3600)) / 60)
  var seconds = secNum - (hours * 3600) - (minutes * 60)

  if (hours < 10) { hours = '0' + hours }
  if (minutes < 10) { minutes = '0' + minutes }
  if (seconds < 10) { seconds = '0' + seconds }
  return (minutes === '00' ? 0 : minutes) + ' minutes, ' + seconds + ' seconds'
}

function getPath (...args) {
  return path.resolve(__dirname, ...args)
}
