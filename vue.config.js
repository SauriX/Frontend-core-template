const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,
/*   devServer: {
    port: 5001,
    https: true,

  }, */
  configureWebpack: {
    devtool: 'source-map',
    
  },
  
  chainWebpack: config => {
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@intlify/vue-i18n-loader');
  }

})
