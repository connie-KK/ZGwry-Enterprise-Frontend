'use strict'
module.exports = {
  dev: {
    corsDomain: 'http://sx.azuratech.com',
    corsMainPort: 31000, // 平台端口
    sharePort: 31001, // 基础数据端口
    samplePort: 31011, // 采样端口
    simulatorPort: 31013, // 模拟端口
    emergencyPort: 31021, // 应急端口
    maintenanceApi: "http://demo.azuratech.com:30005", 
    maintenanceUrl: "http://demo.azuratech.com:51008", 
    frameJS: '/Scripts/aepmod.js',
    defaultProvince: '浙江省',
    defaultCity: '宁波市',
    defaultArea: '鄞州区',
    serverUrl: 'http://localhost:30025/'
  },
  demo: {
    corsDomain: 'http://demo.azuratech.com',
    corsMainPort: 51000, // 平台端口
    sharePort: 51001, // 基础数据端口
    samplePort: 31011, // 采样端口
    simulatorPort: 31013, // 模拟端口
    emergencyPort: 51005, // 应急端口
    maintenanceApi: "http://demo.azuratech.com:30005", 
    maintenanceUrl: "http://demo.azuratech.com:51008", 
    frameJS: '/Scripts/aepmod.js',
    defaultProvince: '浙江省',
    defaultCity: '宁波市',
    defaultArea: '鄞州区',
    serverUrl: 'http://localhost:30005/'
  }
}
