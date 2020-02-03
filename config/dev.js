const merge = require('webpack-merge')
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin')
const local = require('./local')
const baseConfig = require('./base')
var path = require('path')
// aep框架需要注册验证的一些请求
const frameRequest = require('./aep')
// const rewrites = [{ from: /\/index/, to: '/index.html' }]
const rewrites = []
// console.log('before:%O', rewrites)
for (let key in baseConfig.pages) {
  const page = baseConfig.pages[key]
  rewrites.push({
    from: new RegExp(page.from),
    to: page.to
  })
}
// console.log('after:%O', rewrites)
const devConfig = merge(baseConfig, {
  runtimeCompiler: true,
  devServer: {
    before: frameRequest,
    port: 30027,
    // 代理地址
    proxy: {
      '/api': {
        target: 'http://localhost:30016',
        pathRewrite: {
          '^/api': '/api'
        }
      }
    },
    historyApiFallback: {
      // 别名
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        'views': path.resolve(__dirname, '../src/views'),
        '@':  path.resolve(__dirname, '../src')
      },
      rewrites
    }
  },
  configureWebpack: {
    devtool: 'source-map',
    // plugins: [
    //   // 插入额外的aepmod.js
    //   new HtmlWebpackTagsPlugin({
    //     append: false,
    //     publicPath: false,
    //     tags: [`${local.corsDomain}:${local.corsMainPort}/scripts/aepmod.js`]
    //   })
    // ]
  }
})
module.exports = devConfig
