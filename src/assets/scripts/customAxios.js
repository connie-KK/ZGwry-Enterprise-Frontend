import axios from 'axios'
import config from '@/assets/scripts/config'
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
  baseURL: config.maintenanceApi, // api 的 base_url
  timeout: 200000 // 请求超时时间
})

// 请求前缀
const prefix = '/Api/'

// request拦截器
service.interceptors.request.use(
  config => {
    if (!config.data || !config.data.loading) {
      store.commit("set_loading", true)
    }
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
    store.commit("set_loading", false)
    return response.data
  },
  error => {
    store.commit("set_loading", false)
    return Promise.reject(error)
  })

export default service
