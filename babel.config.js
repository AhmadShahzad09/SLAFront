module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/env',
      {
        loose: false,
        modules: false,
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
        }
      }
    ]
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-runtime']
    }
  },
  ignore: ['dist/*'],
  sourceType: 'unambiguous'
}
