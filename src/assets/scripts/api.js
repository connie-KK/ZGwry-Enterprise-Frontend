import axios from 'axios'
import store from 'store'
import router from '@/router'

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
const prefix = 'api/Option/'

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
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
const interfaces = [
  'api1', // 接口列表
  'api2', // 接口列表
  'api3' // 接口列表
]

interfaces.forEach(method => {
  api[method] = payload => {
    return service.post(method, payload)
  }
})

api.logout = () => {
  store.clearAll()
  router.push('login')
}

api.login = (params) => {
  store.set('token', 2)
  return Promise.resolve({params})
}
console.log(api)
export default api
