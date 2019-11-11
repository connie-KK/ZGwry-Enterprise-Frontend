var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://tjbh.azuratech.com:30004/"'
  // BASE_API: '"http://113.106.249.75:50001/"'
})
