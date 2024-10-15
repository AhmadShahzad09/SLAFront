const fs = require('fs')
const path = require('path')
const _ = require('lodash')

// Get all the .vue or .js files in the src directory
const componentFileNames = fs
  .readdirSync(path.resolve(__dirname, '../src/components/'))

const pascalCase = s => _.camelCase(s).charAt(0).toUpperCase() + _.camelCase(s).slice(1)

const componentsLibrary = []

componentFileNames.map(componentFileName => {
  if (!componentFileName.includes('.')) {
    fs.readdirSync(path.resolve(__dirname, '../src/components/' + componentFileName)).map(file => {
      if (pascalCase(componentFileName) === pascalCase(file.split('.')[0]) && !file.includes('.spec')) {
        componentsLibrary.push({
          name: componentFileName,
          entryFile: file
        })
      }
    })
  }
})

// Get the names of the components from the file names
module.exports = componentsLibrary.map(component => {
  return {
    name: pascalCase(component.name).replace('-', ''),
    folder: component.name,
    file: component.entryFile
  }
})
