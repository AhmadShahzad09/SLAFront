module.exports = {
  presets: [
    ['@babel/preset-env', {
      loose: true,
      modules: 'commonjs',
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
      }
    }]
  ]
}
