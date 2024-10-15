module.exports = {
  configureWebpack: {
    output: {
      libraryExport: 'default'
    },
    resolve: {
      symlinks: false
    }
  },
  chainWebpack: config => {
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          resources: [
            'src/components/theme-onesait/common/var.scss'
          ]
        })
        .end()
    })
  }
}