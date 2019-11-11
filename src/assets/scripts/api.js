import axios from 'axios'
import router from '@/router'
import Cookies from 'js-cookie'
const TokenKey = 'aepToken'

// http request 拦截器
let requestInstance = null
let responseInstance = null
if (!!requestInstance || requestInstance === 0) {
  axios.interceptors.request.eject(requestInstance)
}
if (!!responseInstance || responseInstance === 0) {
  axios.interceptors.response.eject(requestInstance)
}

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url     
  timeout: 200000 // 请求超时时间
})

// 请求前缀
const prefix = 'Api/'

// request拦截器
service.interceptors.request.use(
  config => {
    if (Cookies.get(TokenKey)) {
      config.headers['Authorization'] = 'Bearer ' + Cookies.get(TokenKey) // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.url = prefix + config.url
    return config
  },
  error => {
    console.log('%c Error', 'color:white;background-color:#D33F49', error) // for debug
    return Promise.reject(err)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
)

let api = {}

//请求接口集合
const interfaces = [
  { fun: "getLastAQIVals", interface: "FactorData/GetLastAQIValsForPhone", type: "get" }, //获取空气站列表最新质量及PM2.5
  { fun: "getFactorList", interface: "location/GetFactorListSortedPost", type: "post" },  //获取站点相关联因子
  { fun: "getFacVals", interface: "FactorData/GetLastFacValsPost", type: "post" },  //获取站点各关联因子最新数值
  { fun: "getSiteList", interface: "location/PagedList", type: "post" },   //获取站点列表
  { fun: "getFactVal", interface: "FactorData/GetFactValPost", type: "post" },   //获取单个站点时间段内单因子的数值
  { fun: "getAirFactVals", interface: "FactorData/LastValIaqiInList", type: "post" },   //获取所有空气站点的6因子最新平均值Iaqi等
  { fun: "getAriEvaluate", interface: "FactorData/GetLastAQIValPost", type: "post" }   //获取空气站点当前最新空气质量评价
]


interfaces.forEach(method => {
  api[method.fun] = payload => {
    return service[method.type](method.interface, payload)
  }
})

api.logout = () => {
  Cookies.remove(TokenKey)
  router.push('login')
}

api.login = (params) => {
  Cookies.set(TokenKey, 2)
  return Promise.resolve({ params })
}
export default api
